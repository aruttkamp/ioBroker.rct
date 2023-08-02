const net = require('net');
const rct = require('./rct_core.js');

module.exports = rct;

// flag for local debugging
const DEBUG_CONSOLE = false;
let __refreshTimeout = null;
let __client = null;

rct.getStateInfo = function (rctName, iobInstance) {

	// Prüfen ob Parameter bekannt ist.
	if (!rct.cmd[rctName]) {
		iobInstance.log.warn(`Invalid RCT name: ${rctName}`);
		return false;
	}
	//Zuweisen Name
	let name = rctName;
	// remove all ']' characters
	name = name.replace(/]/g, '');

	// if '[' comes before first '.', replace it by '.' and hence make it part of state name
	if (name.search(/\[/) < name.search(/\./)) name = name.replace('[', '.');

	const elements = name.split('.');

	let channelName, stateName, stateFullName;

	if (elements.length === 1) {
		channelName = '';
		stateName = name.name.replace(/(\.|\[)/g, '_').replace(/_+/g, '_');
		stateFullName = stateName;
	} else {
		channelName = elements.shift();
		stateName = elements.join('_').replace(/(\.|\[)/g, '_').replace(/_+/g, '_');
		stateFullName = channelName + '.' + stateName;
	}

	if (DEBUG_CONSOLE==true) {
		console.log(`DEBUG ${channelName} > ${stateName} > ${stateFullName}`);
	}
	return { channelName, stateName, stateFullName };
};

rct.end = function () {
	if (__client) {
		try {
			__client.end();
		} catch (err) {
			// ignore
		}
		__client = null;
	}
	if (__refreshTimeout) {
		clearTimeout(__refreshTimeout);
		__refreshTimeout = null;
	}
};

rct.process = function (host, rctElements, iobInstance) {

	__client = net.createConnection({ host, port: 8899 }, () => {

		function requestElements() {
			if (!__client) {
				return;
			}
			rctElements.forEach((e) => {
				if (rct.cmd[e]) {
					__client.write(getFrame(rct.const.command_byte_read, rct['cmd'][e].id));
				}
			});
			__refreshTimeout = setTimeout(requestElements, (1000 * iobInstance.config.rct_refresh) || 15000);
		}

		iobInstance.log.info(`RCT: connected to server at ${host}`);

		// eslint-disable-next-line no-undef
		connectionStatus = true;
		requestElements();
	});


	let dataBuffer = Buffer.alloc(0);

	__client.on('data', (data) => {

		function escaping(element, index, array) {
			if (element == rct.const.stop_byte_value) {
				// console.log('DEBUG escaping()', element, index, array);
				if (index < array.length - 1) {

					if (array[index + 1] == rct.const.start_byte_value || array[index + 1] == rct.const.stop_byte_value) {
						// console.log('DEBUG: dropping escape character');
						return false; // ignore escape character
					} else {
						// console.log('DEBUG: NOT dropping escape character');
					}

				} else console.log('NOTICE: not handling escape character at end of buffer');
			}
			return true;
		}

		console.log('DEBUG data received', data);
		dataBuffer = Buffer.concat([dataBuffer, data.filter(escaping)]);

		handleData();
	});


	function handleData() {

		while (dataBuffer.length && dataBuffer[0] != 43) {
			if (dataBuffer[0] != 0) {
				if (DEBUG_CONSOLE) console.log('DEBUG: skipping', dataBuffer[0]); // FIXME: regularly skipping 0 values - no idea why
			}
			dataBuffer = dataBuffer.slice(1);
		}

		/*
		if (dataBuffer.length >= 4) {
			if (dataBuffer[0]==65 && dataBuffer[1]==84 && dataBuffer[2]==43 && dataBuffer[3]==13) {
				console.log('DEBUG skipping 65, 84, 43, 13 sequence');
				dataBuffer = dataBuffer.slice(4);
			}
		}
		*/

		if (dataBuffer.length < 5) return; // not enough data

		const frameLength = getFrameLength(dataBuffer);
		if (DEBUG_CONSOLE==true) {
			console.log('DEBUG handleData()',byteArray2HexString(dataBuffer, true), dataBuffer.length, frameLength);
		}
		if (dataBuffer.length < frameLength) {
			console.log('DEBUG full frame not yet received', dataBuffer, dataBuffer.length, frameLength);
			return;
		}

		const cmdBuffer = dataBuffer.slice(0, frameLength);
		dataBuffer = dataBuffer.slice(frameLength);

		const response = parseResponse(cmdBuffer);

		if (response.crcOk) {
			let txt;

			if (response.description) txt = `${response.description}: ${response.result} ${response.unit}`;
			else if (response.name) txt = `${response.name}: ${response.result} ${response.unit}`;
			else txt = response.infoText;

			if (response.name && rctElements.includes(response.name)) {
				//iobInstance.log.debug(`RCT: result: ${txt}`);
				const stateInfo = rct.getStateInfo(response.name, iobInstance);
				if (stateInfo) {
					iobInstance.setState(stateInfo.stateFullName, response.result, true);
				}
			} else {
				if (DEBUG_CONSOLE) console.debug(`RCT: received, but not requested: ${txt}`);
			}

		} else {
			console.log('NOTICE: CRC not valid', cmdBuffer, response.id);
		}

		handleData(); // continue and check if new data is available;
	}

	__client.on('end', () => {
		iobInstance.log.info('RCT: disconnected from server');
		//console.log('disconnected from server');
		// clear refresh timeout and reconnect
		__client = null;
		if (__refreshTimeout) {
			clearTimeout(__refreshTimeout);
		}
		__refreshTimeout = setTimeout(() => rct.process(host, rctElements, iobInstance), (1000 * iobInstance.config.rct_refresh) || 15000);
	});

	function getFrameLength(buf) {
		const cmd = buf.readInt8(1);

		//check for short or long response
		if (cmd == 3 || cmd == 6) {
			return 6 + buf.readUInt16LE(2);  // long response
		} else {
			return 5 + buf.readUInt8(2); // short response
		}
	}

	function parseResponse(buf) {

		const response = {};

		response.crcOk = buf.slice(-2).readUInt16BE() == rct.crc(buf.slice(1, -2));

		response.cmd = buf.readInt8(1);

		if (response.cmd == 3 || response.cmd == 6) {
			// long response
			response.length = buf.readUInt16BE(2);
			response.id = byteArray2HexString(buf.slice(4, 8));
			response.data = buf.slice(8, -2);
		} else {
			response.length = buf.readUInt8(2);
			response.id = byteArray2HexString(buf.slice(3, 7));
			response.data = buf.slice(7, -2);
		}

		response.infoText = `${response.cmd} ${response.length - 4} ${response.id}`;

		// in case CRC is not ok, return here (as data might be faulty)
		if (!response.crcOk) return response;

		if (!rct.cmdReverse[response.id]) {
			if (DEBUG_CONSOLE) console.debug(`RCT: unknown response.id ${response.id}`);
			return response;
		}

		response.name = rct.cmdReverse[response.id].name;
		response.description = rct.cmdReverse[response.id].description;
		response.dataType = rct.cmdReverse[response.id].type;
		response.dataLength = rct.cmdReverse[response.id].length;
		response.multiplier = rct.cmdReverse[response.id].multiplier;
		response.precision = rct.cmdReverse[response.id].precision;
		response.unit = rct.cmdReverse[response.id].unit || '';

		if (!response.dataType) {
			switch (response.length - 4) {
				case 1: response.dataType = 'uint1'; break;
				case 2: response.dataType = 'uint2'; break;
				case 4: response.dataType = 'float'; break;
				default: console.log('DEBUG unknown dataType', response.length - 4); break;
			}
		}

		if (response.dataType === 'uint4' && response.data.length !== 4) {
			console.log('DEBUG: wrong length for uint4: ', response);
			response.dataType = '';
		}


		if ((response.dataType === 'float' && response.data.length != 4) ||
			(response.dataType === 'uint1' && response.data.length != 1) ||
			(response.dataType === 'uint2' && response.data.length != 2) ||
			(response.dataType === 'uint4' && response.data.length != 4)) {
			console.log('NOTICE: wrong length for data type', response);
			//console.log('NOTICE: ', response.data.length);
			response.dataType = '';
		}

		let result;
		switch (response.dataType) {
			case 'float':
				result = response.data.readFloatBE();
				if (response.multiplier !== undefined) result = result * response.multiplier;
				response.result = floatPrecision(result, response.precision);
				break;
			case 'uint1':
				response.result = response.data.readUInt8();
				break;
			case 'uint2':
				response.result = response.data.readUInt16LE();
				break;
			case 'uint4':
				response.result = response.data.readUInt32LE();
				break;
			default: response.result = ''; break;
		}

		//console.log("DEBUG response:",response);
		return response;
	}

	function floatPrecision(number, precision) {
		if (precision === undefined) precision = 1;
		return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
	}

	function getFrame(command, id, data = '') {
		let sTmp = '';
		sTmp += command;
		sTmp += byte2HexString((id.length + data.length) / 2);
		sTmp += id;
		sTmp += data;

		const baFrame = HexString2ByteArray(rct.const.start_byte + sTmp);

		//console.log('DEBUG: baFrame', rct.const.start_byte + sTmp);

		const crc = rct.crc(HexString2ByteArray(sTmp));
		baFrame.push(crc >> 8);
		baFrame.push(crc & 0xFF);

		// console.log("DEBUG: getFrame()",byteArray2HexString(baFrame));
		return Buffer.from(baFrame);
	}

	function HexString2ByteArray(str) {
		const result = [];
		// Ignore any trailing single digit; I don't know what your needs
		// are for this case, so you may want to throw an error or convert
		// the lone digit depending on your needs.
		str = str.replace(' ', '');

		while (str.length >= 2) {
			result.push(parseInt(str.substring(0, 2), 16));
			str = str.substring(2, str.length);
		}

		return result;
	}

	function byteArray2HexString(arr, format) {
		let result = '';
		for (const i in arr) {
			// eslint-disable-next-line no-prototype-builtins
			if (arr.hasOwnProperty(i)) {
				let str = arr[i].toString(16);
				// Pad to two digits, truncate to last two if too long.  Again,
				// I'm not sure what your needs are for the case, you may want
				// to handle errors in some other way.
				str = str.length == 0 ? '00' :
					str.length == 1 ? '0' + str :
						str.length == 2 ? str :
							str.substring(str.length - 2, str.length);

				str = str.toUpperCase();
				if (format && str === '2B') str = ' 2B'; // seperate commands with leading space
				if (format && str === '2D') str = ' !!!2D!!! '; // mark stop/escape byte
				result += str;
			}
		}
		return result;
	}

	function byte2HexString(byte) {
		let result = byte.toString(16);

		// Pad to two digits, truncate to last two if too long.  Again,
		// I'm not sure what your needs are for the case, you may want
		// to handle errors in some other way.
		result = result.length === 0 ? '00' :
			result.length === 1 ? '0' + result :
				result.length === 2 ? result : result.substring(result.length - 2, result.length);

		return result;
	}

};
