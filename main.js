'use strict';

/*
 * Created with @iobroker/create-adapter v1.33.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const rct = require('./rct/rct.js');

// selected elements are stored per admin section in native.rct_elements_<section>
const ELEMENTS_PREFIX = 'rct_elements_';
const collectElements = native => [
    ...new Set(
        Object.keys(native)
            .filter(k => k.startsWith(ELEMENTS_PREFIX))
            .flatMap(k => (Array.isArray(native[k]) ? native[k] : [])),
    ),
];

// standard elements if nothing is selected in the admin
const DEFAULT_ELEMENTS = collectElements(require('./io-package.json').native);

// Load your modules here, e.g.:
// const fs = require("node:fs");

class Rct extends utils.Adapter {
    /**
     * @param {Partial<utils.AdapterOptions>} [options] Optional adapter options
     */
    constructor(options) {
        super({
            ...options,
            name: 'rct',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        // Initialize your adapter here

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info(`config rct_ip: ${this.config.rct_ip}`);

        await this.migrateElementConfig();
        // Reset the connection indicator during startup
        //this.setState('info.connection',false,true);

        // keine IP konfiguriert
        if (!this.config.rct_ip) {
            this.log.warn('No IP-address set / cancelling initialization');
            return;
        }

        //refresh vorbelegen wenn nicht definiert
        if (!this.config.rct_refresh) {
            this.config.rct_refresh = 10;
        }

        //debug logging vorbelegen wenn nicht definiert
        if (!this.config.debug_logging) {
            this.config.debug_logging = false;
        }
        //debug Information wird an rct.js übergeben
        rct.initialize(this.config.debug_logging, this);

        //Wenn keine Elemente konfiguriert sind - Defaultwerte laden
        const selected = collectElements(this.config);
        const rctElements = selected.length ? selected : DEFAULT_ELEMENTS;
        try {
            // add states
            //const rctElements = this.config.rct_elements.split(',');

            for (const e of rctElements) {
                const stateInfo = rct.getStateInfo(e, this); //Parameter Namen prüfen , zerlegen und ggfls. korrigieren
                if (stateInfo) {
                    const { channelName, stateName, stateFullName } = stateInfo;

                    if (channelName) {
                        await this.setObjectNotExistsAsync(channelName, {
                            type: 'channel',
                            common: { name: channelName },
                            native: {},
                        });
                    }

                    const rct_id = rct.cmd[e].id;
                    const name = rct.cmdReverse[rct_id].description || stateName;
                    const unit = (rct.cmdReverse[rct_id].unit || '').trim();
                    const rct_type = rct.cmdReverse[rct_id].type;
                    const type = rct.cmdReverse[rct_id].ioBrokerType;

                    //const common = { name, type: 'number', unit, role: 'value', read: true, write: false };
                    const role = type === 'boolean' ? 'indicator' : 'value';
                    const common = { name, type, unit, role, read: true, write: false };
                    if (unit === '%') {
                        common.min = 0;
                        common.max = 100;
                    }
                    const subStates = rct.getSubStates(rct_type);
                    if (subStates) {
                        for (const s of subStates) {
                            await this.setObjectNotExistsAsync(`${stateFullName}${s.suffix}`, {
                                type: 'state',
                                common: { ...common, unit: s.unit },
                                native: {},
                            });
                        }
                    } else {
                        await this.setObjectNotExistsAsync(stateFullName, {
                            type: 'state',
                            common,
                            native: {},
                        });
                    }
                } else {
                    this.log.info(`rct state not defined: ${e}`);
                }
            }
        } catch (err) {
            this.log.error(`Error during state creation / cancelling initialization: ${err}`);
        }

        this.log.debug('Adapter initialization completed: start processing');
        rct.process(this.config.rct_ip, rctElements, this);
    }

    /**
     * Until 1.2.x the elements were stored as comma separated string in native.rct_elements.
     * Distribute them once to the admin sections native.rct_elements_<section>.
     */
    async migrateElementConfig() {
        const legacy = this.config.rct_elements;
        if (typeof legacy !== 'string' && !Array.isArray(legacy)) {
            return;
        }
        let elements = (Array.isArray(legacy) ? legacy : legacy.split(',')).map(e => String(e).trim()).filter(Boolean);
        if (!elements.length) {
            // leerer String bedeutete "Standard" - Standardauswahl sichtbar in die Auswahllisten übernehmen
            elements = DEFAULT_ELEMENTS;
        }

        // all sections are written, as an update may already have filled them with the default selection
        const native = { rct_elements: null };
        for (const section of rct.configSections) {
            native[`${ELEMENTS_PREFIX}${section}`] = elements.filter(e => rct.getConfigSection(e) === section);
        }
        this.log.info(`Migrating element configuration to selection lists (${elements.length} elements)`);
        await this.extendForeignObjectAsync(`system.adapter.${this.namespace}`, { native });
        Object.assign(this.config, native);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param {() => void} callback Callback function to execute after clean shutdown
     */
    async onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);
            rct.end(this.config.rct_ip, this);
            this.setState('info.connection', false, true);
            callback();
        } catch (e) {
            callback(e);
        }
    }

    /**
     * Is called if a subscribed state changes
     *
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options] Optional adapter options
     */
    module.exports = options => new Rct(options);
} else {
    // otherwise start the instance directly
    new Rct();
}
