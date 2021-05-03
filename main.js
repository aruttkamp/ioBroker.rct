'use strict';

/*
 * Created with @iobroker/create-adapter v1.33.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');
const rct = require('./rct/rct_core.js');
const rct_process = require('./rct/rct.js');

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
		this.on('stateChange', this.onStateChange.bind(this));
		// this.on('objectChange', this.onObjectChange.bind(this));
		// this.on('message', this.onMessage.bind(this));
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

		if (!this.config.rct_ip) {
			this.log.warn('No IP-address set / cancelling initialization');
			return;
		}

		if (!this.config.rct_refresh) this.config.rct_refresh = 10;

		if (!this.config.rct_elements) this.config.rct_elements = 'battery.soc,battery.soc_target,battery.soc_target_low,battery.soc_target_high,dc_conv.dc_conv_struct[0].p_dc_lp,dc_conv.dc_conv_struct[1].p_dc_lp,g_sync.p_ac_grid_sum_lp,g_sync.p_acc_lp,g_sync.p_ac_load_sum_lp';

		await this.setObjectNotExistsAsync('info', {
			type: 'channel',
			common: { name: 'Information' },
			native: {},
		});

		// add states
		const rctElements = this.config.rct_elements.split(',');

		rctElements.forEach(async (e) => {
			if (rct.cmd[e]) {
				const rct_id = rct.cmd[e].id;
				const stateName = e.replace(/(\.|\[)/g, '_').replace(/(\])/g,'');
				const name = rct.cmdReverse[rct_id].description || stateName;
				const unit = (rct.cmdReverse[rct_id].unit || '').trim();
				const common = { name, type: 'number', unit, role: 'indicator', read: true, write: false };
				if (unit == '%') {
					common.min = 0;
					common.max = 100;
				}
				await iobInstance.setObjectNotExistsAsync('info.' + stateName, {
					type: 'state',
					common,
					native: {},
				});
			} else iobInstance.log.info('rct state not defined: ' + e);
		});

		rct_process(this.config.rct_ip, rctElements, this);

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		// this.subscribeStates('battery_soc');
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates('lights.*');
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates('*');

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable battery_soc is set to true as command (ack=false)
		//await this.setStateAsync('battery_soc', true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		//await this.setStateAsync('battery_soc', { val: true, ack: true });
		// await this.setStateAsync('info.battery_soc', 93.4, true);

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		//await this.setStateAsync('battery_soc', { val: true, ack: true, expire: 30 });



		// examples for the checkPassword/checkGroup functions
		//let result = await this.checkPasswordAsync('admin', 'iobroker');
		//this.log.info('check user admin pw iobroker: ' + result);

		//result = await this.checkGroupAsync('admin', 'admin');
		//this.log.info('check group user admin group admin: ' + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === 'object' && obj.message) {
	// 		if (obj.command === 'send') {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info('send command');

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
	// 		}
	// 	}
	// }

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