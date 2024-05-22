'use strict';

/*
 * Created with @iobroker/create-adapter v1.33.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const rct = require('./rct/rct.js');

// Load your modules here, e.g.:
// const fs = require("fs");

class Rct extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
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

		const iobInstance = this;

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info('config rct_ip: ' + this.config.rct_ip);
		// Reset the connection indicator during startup
		//this.setState('info.connection',false,true);

		// keine IP konfiguriert
		if (!this.config.rct_ip) {
			this.log.warn('No IP-address set / cancelling initialization');
			return;
		}

		//refresh vorbelegen wenn nicht definiert
		if (!this.config.rct_refresh) this.config.rct_refresh = 10;

		//Wenn keine Elemente konfiguriert sind - Defaultwerte laden
		if (!this.config.rct_elements) this.config.rct_elements = 'battery.bat_status,battery.soc,battery.soc_target,battery.soc_target_high,battery.soc_target_low,dc_conv.dc_conv_struct[0].p_dc_lp,dc_conv.dc_conv_struct[1].p_dc_lp,fault[0].flt,fault[1].flt,fault[2].flt,fault[3].flt,g_sync.p_ac_grid_sum_lp,g_sync.p_ac_load_sum_lp,g_sync.p_ac_sum_lp,g_sync.p_acc_lp,g_sync.u_sg_avg[0],g_sync.u_sg_avg[1],io_board.s0_external_power,power_mng.is_heiphoss,power_mng.state,power_mng.u_acc_mix_lp,prim_sm.island_flag';
		//this.config.rct_elements = 'prim_sm.state';

		//this.config.rct_elements = 'battery.soc';
		const rctElements = this.config.rct_elements.split(',');
		try {
		// add states
			//const rctElements = this.config.rct_elements.split(',');

			for (const e of rctElements) {
				const stateInfo = rct.getStateInfo(e, this); //Parameter Namen prüfen , zerlegen und ggfls. korrigieren
				if (stateInfo) {

					const { channelName, stateName, stateFullName } = stateInfo;

					if (channelName) {
						await iobInstance.setObjectNotExistsAsync(channelName, {
							type: 'channel',
							common: { name: channelName },
							native: {},
						});
					}

					const rct_id = rct.cmd[e].id;
					const name = rct.cmdReverse[rct_id].description || stateName;
					const unit = (rct.cmdReverse[rct_id].unit || '').trim();
					const type = (rct.cmdReverse[rct_id].ioBrokerType);

					//const common = { name, type: 'number', unit, role: 'value', read: true, write: false };
					const common = { name, type, unit, role: 'value', read: true, write: false };
					if (unit === '%') {
						common.min = 0;
						common.max = 100;
					}
					await iobInstance.setObjectNotExistsAsync(stateFullName, {
						type: 'state',
						common,
						native: {},
					});
				} else iobInstance.log.info('rct state not defined: ' + e);
			}
		} catch (err) {
			this.log.error('Error during state creation / cancelling initialization');
		}

		console.debug('onReady() rct.process(): start processing');
		rct.process(this.config.rct_ip, rctElements, this);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	async onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			rct.end(this.config.rct_ip, rctElements, this);
			iobInstance.log.info('RCT: disconnected from server(main)');
			this.setState('info.connection',false,true);
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */


}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Rct(options);
} else {
	// otherwise start the instance directly
	new Rct();
}
