const net = require('node:net');
const rct = require('./rct_core2.js');

module.exports = rct;

// flag for local debugging
let DEBUG_CONSOLE = false;
rct.initialize = function (debug, iobInstance) {
    DEBUG_CONSOLE = debug;
    if (DEBUG_CONSOLE && iobInstance) {
        iobInstance.log.info('Debug logging is enabled');
    }
};

let __refreshTimeout = null;
let __reconnect = null;
let __client = null;
let __connection = false;

rct.getStateInfo = function (rctName, iobInstance) {
    if (!rct.cmd[rctName]) {
        iobInstance.log.warn(`Invalid RCT name: ${rctName}`);
        return false;
    }

    let name = String(rctName);

    name = name.replace(/]/g, '');

    const dotPos = name.indexOf('.');
    const bracketPos = name.indexOf('[');

    if (bracketPos !== -1 && (dotPos === -1 || bracketPos < dotPos)) {
        name = name.replace(/\[/g, '.');
    }

    const elements = name.split('.');

    let channelName, stateName, stateFullName;

    if (elements.length === 1) {
        channelName = 'general'; // stabil für ioBroker Objektbaum
        stateName = name.replace(/(\.|\[)/g, '_').replace(/_+/g, '_');
    } else {
        channelName = elements.shift();
        stateName = elements
            .join('_')
            .replace(/(\.|\[)/g, '_')
            .replace(/_+/g, '_');
    }

    stateFullName = `${channelName}.${stateName}`;

    return { channelName, stateName, stateFullName };
};

rct.reconnect = function (host, iobInstance) {
    if (__client) {
        try {
            __client.end();
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(`RCT: starting to terminate interval connection to inverter at ${host}`);
            }
        } catch (err) {
            iobInstance.log.error(`RCT: reconnection not working: ${err}!`);
            __client.destroy();
            __client = null;
            __connection = false;
        }
        clearTimeout(__reconnect);
    }
};

rct.end = function (host, iobInstance) {
    clearTimeout(__reconnect);
    clearInterval(__refreshTimeout);
    __connection = false;
    iobInstance.log.info(`RCT: terminated connection to inverter at ${host}`);
    if (__client) {
        try {
            __client.end();
            __client = null;
        } catch (err) {
            __client.destroy(err);
        }
    }
};
rct.process = function (host, rctElements, iobInstance) {
    if (__client) {
        if (!__client.destroyed) {
            try {
                __client.destroy();
                __client = null;
                iobInstance.log.warn('RCT: Connection error! Previous interval connection not successfully completed!');
                clearTimeout(__reconnect);
                clearInterval(__refreshTimeout);
                __refreshTimeout = iobInstance.setTimeout(() => rct.process(host, rctElements, iobInstance), 60000);
                __connection = false;
                return;
            } catch (err) {
                iobInstance.log.error(
                    `RCT: Connection error! Previous interval connection not successful and closure failed: ${err}`,
                );
            }
        }
    }

    if (DEBUG_CONSOLE) {
        iobInstance.log.debug(`RCT: Starting interval connection to inverter at ${host}`);
    }
    __client = net.createConnection({ host, port: 8899 }, () => {});
    // Verbindungsüberwachende Maßnahmen
    if (DEBUG_CONSOLE) {
        __client.on('close', () => {
            //Test ob eine Verbindung erfolgreich abgebaut wurde.
            iobInstance.log.debug(`RCT: Interval connection to inverter at ${host} closed`);
        });
        __client.on('end', () => {
            //Test ob eine Verbindung erfolgreich abgebaut werden soll.
            iobInstance.log.debug(`RCT: Terminating interval connection to inverter at ${host}`);
        });
    }

    let dataBuffer = Buffer.alloc(0);

    __client.on('connect', () => {
        if (!__connection) {
            iobInstance.log.info(`RCT: Initial connection successful to inverter at ${host}!`);
            iobInstance.setState('info.connection', true, true);
            clearInterval(__refreshTimeout);
            __refreshTimeout = iobInstance.setInterval(
                () => rct.process(host, rctElements, iobInstance),
                1000 * iobInstance.config.rct_refresh,
            );
            __connection = true;
        }

        if (DEBUG_CONSOLE) {
            iobInstance.log.debug(`RCT: Interval connection to inverter at ${host} successfully established`);
        }

        function requestElements() {
            /*if (!__client) {
				if (DEBUG_CONSOLE) iobInstance.log.warn(`RCT: interval connection to inverter at ${host} failed! Data retrieval not possible!`);
				return;
			}*/
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(`RCT: Requesting elements "${rctElements}" from inverter`);
            }
            rctElements.forEach(e => {
                if (rct.cmd[e]) {
                    __client.write(getFrame(rct.const.command_byte_read, rct['cmd'][e].id));
                }
                if (!__client) {
                    return;
                }
            });
        }
        requestElements();
        __reconnect = iobInstance.setTimeout(() => rct.reconnect(host, iobInstance), 2000);
    });

    __client.on('error', err => {
        iobInstance.log.error(`RCT: Connection error, please check configured inverter ip address and network: ${err}`);
        __client = null;
        __connection = false;
        iobInstance.setState('info.connection', false, true);
        clearTimeout(__reconnect);
        clearInterval(__refreshTimeout);
        __refreshTimeout = iobInstance.setTimeout(() => rct.process(host, rctElements, iobInstance), 120000);
    });

    __client.on('data', data => {
        function escaping(element, index, array) {
            if (element === rct.const.stop_byte_value) {
                // console.log('DEBUG escaping()', element, index, array);
                if (index < array.length - 1) {
                    if (
                        array[index + 1] === rct.const.start_byte_value ||
                        array[index + 1] === rct.const.stop_byte_value
                    ) {
                        // console.log('DEBUG: dropping escape character');
                        return false; // ignore escape character
                    }
                    // console.log('DEBUG: NOT dropping escape character');
                } else {
                    iobInstance.log.debug('NOTICE: not handling escape character at end of buffer');
                }
            }
            return true;
        }

        if (DEBUG_CONSOLE) {
            iobInstance.log.debug('DEBUG data received', data);
        }
        dataBuffer = Buffer.concat([dataBuffer, data.filter(escaping)]);

        handleData();
    });

    function handleData() {
        while (dataBuffer.length && dataBuffer[0] !== 43) {
            if (dataBuffer[0] !== 0) {
                if (DEBUG_CONSOLE) {
                    iobInstance.log.debug('DEBUG: skipping', dataBuffer[0]);
                } // FIXME: regularly skipping 0 values - no idea why
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

        // Early return for no data in buffer
        if (dataBuffer.length < 5) {
            return;
        }

        const frameLength = getFrameLength(dataBuffer);

        // Early return for incomplete frames
        if (dataBuffer.length < frameLength) {
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug('Frame incomplete', {
                    received: dataBuffer.length,
                    required: frameLength,
                    waiting: frameLength - dataBuffer.length,
                    preview: byteArray2HexString(dataBuffer.slice(0, 8), true),
                });
            }
            return;
        }

        // Debug-Info for complete frames
        if (DEBUG_CONSOLE) {
            iobInstance.log.debug(
                `Processing frame: size=${frameLength}, type=${frameLength === 6 ? 'short' : 'long'}`,
            );
        }

        const cmdBuffer = dataBuffer.slice(0, frameLength);
        dataBuffer = dataBuffer.slice(frameLength);

        const response = parseResponse(cmdBuffer);

        if (response.crcOk) {
            let txt;
            if (response.description) {
                txt = `${response.description}: ${response.result} ${response.unit}`;
            } else if (response.name) {
                txt = `${response.name}: ${response.result} ${response.unit}`;
            } else {
                txt = response.infoText;
            }

            if (response.name && rctElements.includes(response.name)) {
                //iobInstance.log.debug(`RCT: result: ${txt}`);
                if (DEBUG_CONSOLE) {
                    iobInstance.log.debug(`RCT: received: ${txt}`);
                }
                const stateInfo = rct.getStateInfo(response.name, iobInstance);
                if (stateInfo) {
                    if (response.dataType == 'cell_voltage') {
                        let i = 0;
                        response.result.forEach(r => {
                            iobInstance.setState(`${stateInfo.stateFullName}_${i}`, parseFloat(r.V.toFixed(3)), true);

                            //iobInstance.log.info(
                            //    `${r.zelle.toString().padStart(5)} | ` +
                            //    `${r.rohwert.toString().padStart(9)} | ` +
                            //    `${r.mV.toFixed(2).padStart(8)} | ` +
                            //    `${r.V.toFixed(3)}`
                            //);
                            i++;
                        });
                    } else {
                        iobInstance.setState(stateInfo.stateFullName, response.result, true);
                    }
                }
            } else {
                if (DEBUG_CONSOLE) {
                    iobInstance.log.debug(`RCT: received, but not requested: ${txt}`);
                }
            }
        } else {
			const actualLen = dataBuffer.length;
            let expectedLen = "UNKNOWN";
            let isSyncOk = dataBuffer[0] === 0x2B; // 0x2B ist das '+' Zeichen in Hex (RCT Start-Byte)

            if (actualLen >= 3) {
            // RCT schreibt die Paketlänge meist in Byte 1 und 2 (Big Endian)
            // (Achtung: Prüfe im Code, ob RCT die Länge exklusive oder inklusive Header rechnet!)
            expectedLen = dataBuffer.readUInt16BE(1); 
            }

            iobInstance.log.debug(
              `[CRC ERROR DETAILS]\n` +
              ` ├─ Sync-Byte (+):    ${isSyncOk ? 'OK (0x2b)' : `FEHLER (0x${dataBuffer[0].toString(16)})`}\n` +
              ` ├─ Erwartete Länge:  ${expectedLen} Bytes (laut Header)\n` +
              ` ├─ Empfangene Länge: ${actualLen} Bytes im aktuellen Puffer\n` +
              ` └─ Hex-Dump (Top20): ${dataBuffer.subarray(0, 20).toString('hex')}`
            );
            //iobInstance.log.debug(`NOTICE: CRC not valid: ${response.name}, ${response.description}, ${response.id}`);
        }

        if (response.crcOk) {
            handleData(); // continue and check if new data is available;
        }
    }

    function getFrameLength(buf) {
        const cmd = buf.readInt8(1);

        //check for short or long response
        if (cmd === 3 || cmd === 6) {
            return 6 + buf.readUInt16LE(2); // long response
        }
        return 5 + buf.readUInt8(2); // short response
    }

    function parseResponse(buf) {
        const response = {};

        response.crcOk = buf.slice(-2).readUInt16BE() === rct.crc(buf.slice(1, -2));

        response.cmd = buf.readInt8(1);

        if (response.cmd === 3 || response.cmd === 6) {
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
        if (!response.crcOk) {
            return response;
        }

        if (!rct.cmdReverse[response.id]) {
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(`RCT: unknown response.id ${response.id}`);
            }
            return response;
        }

        response.name = rct.cmdReverse[response.id].name;
        response.description = rct.cmdReverse[response.id].description;
        response.dataType = rct.cmdReverse[response.id].type;
        response.dataLength = rct.cmdReverse[response.id].length;
        response.multiplier = rct.cmdReverse[response.id].multiplier;
        response.precision = rct.cmdReverse[response.id].precision;
        response.unit = rct.cmdReverse[response.id].unit || '';

        //		if (!response.dataType) {
        //			switch (response.length - 4) {
        //				case 1: response.dataType = 'uint1'; break;
        //				case 2: response.dataType = 'uint2'; break;
        //				case 4: response.dataType = 'float'; break;
        //				default: console.log('DEBUG unknown dataType', response.length - 4); break;
        //			}
        //		}

        //		if (response.dataType === 'uint4' && response.data.length !== 4) {
        //			console.log('DEBUG: wrong length for uint4: ', response);
        //			response.dataType = '';
        //		}

        //		if ((response.dataType === 'float' && response.data.length != 4) ||
        //			(response.dataType === 'uint1' && response.data.length != 1) ||
        //			(response.dataType === 'uint2' && response.data.length != 2) ||
        //			(response.dataType === 'uint4' && response.data.length != 4)) {
        //			console.log('NOTICE: wrong length for data type', response);
        //			console.log('NOTICE: ', response.data.length);
        //			response.dataType = '';
        //		}

        let result;
        switch (response.dataType) {
            case 'FLOAT':
                //console.log(response.name);
                //console.log('response.data : ' + response.data);
                //console.log('länge: ' + response.data.length);
                if (response.data.length === 4) {
                    result = response.data.readFloatBE();
                }
                //console.log('result: ' + result);
                //console.log('multiplier: ' + response.multiplier);
                //if (response.multiplier !== undefinded) response.mulitplier=100;
                if (response.multiplier !== undefined) {
                    result = result * response.multiplier;
                }
                response.result = floatPrecision(result, response.precision);
                break;
            case 'UINT8':
                if (response.data.length > 0) {
                    response.result = response.data.readUInt8();
                } else {
                    response.result = 0;
                }
                break;
            case 'INT8':
                if (response.data.length > 0) {
                    response.result = response.data.readInt8();
                } else {
                    response.result = 0;
                }
                break;
            case 'UINT16':
                if (response.data.length > 0) {
                    response.result = response.data.readUInt16LE();
                } else {
                    response.result = 0;
                }
                break;
            case 'INT16':
                if (response.data.length > 0) {
                    response.result = response.data.readInt16BE();
                } else {
                    response.result = 0;
                }
                break;
            case 'UINT32':
                if (response.data.length > 0) {
                    response.result = response.data.readUInt32LE();
                } else {
                    response.result = 0;
                }
                break;
            case 'INT32':
                if (response.data.length > 0) {
                    response.result = response.data.readInt32BE();
                } else {
                    response.result = 0;
                }
                break;
            case 'STRING':
                response.result = response.data.Buffer;
                break;
            case 'cell_voltage':
                response.result = decodeRCTCells(response.data);
                break;
            case 'RAW':
                iobInstance.log.info('RAW');
                iobInstance.log.info(`response.data : ${response.data}`);
                iobInstance.log.info(`response.data Hex : ${response.data.toString('hex')}`);
                iobInstance.log.info(`response.data Buf : ${response.data.Buffer}`);
                response.result = response.data.toString('hex');
                break;
            case 'ENUM':
                break;
            default:
                response.result = '';
                break;
        }

        //console.log("DEBUG response:",response);
        return response;
    }

    function floatPrecision(number, precision) {
        if (precision === undefined) {
            precision = 1;
        }
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
        baFrame.push(crc & 0xff);

        // console.log("DEBUG: getFrame()",byteArray2HexString(baFrame));
        return Buffer.from(baFrame);
    }

    function decodeRCTCells(buffer) {
        const result = [];
        // 4 Bytes pro Wert
        const cellCount = Math.floor(buffer.length / 4);

        for (let i = 0; i < cellCount; i++) {
            const offset = i * 4;

            // Little Endian uint32 lesen
            const value = buffer.readUInt32LE(offset);

            // Skalierung (Möglichkeit D)
            const mV = value / 256;
            const V = mV / 1000;
            //iobInstance.log.info(V);

            result.push({
                zelle: i + 1,
                rohwert: value,
                mV: mV,
                V: V,
            });
        }

        return result;

        //for (let i = 0; i < totalCells; i++) {
        // Ein Float32 (4 Bytes) pro Zelle auslesen
        // RCT nutzt meist Little-Endian (readFloatLE)
        //    try {
        //        let voltage = buffer.readFloatLE(i * 4);

        // Plausibilitäts-Check: LiFePO4 Zellen liegen zwischen 2.0V und 3.7V
        //        if (voltage > 0 && voltage < 5) {
        //setState(`javascript.0.RCT_Batterie.Zelle_${(i + 1).toString().padStart(2, '0')}`, parseFloat(voltage.toFixed(3)), true);
        //            iobInstance.log.info('cell voltage :' && parseFloat(voltage.toFixed(3)))
        //        }
        //    } catch (e) {
        //        iobInstance.log.info(`Fehler beim Lesen von Zelle ${i + 1}: ` + e);
        //    }
        //}
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
            if (Object.prototype.hasOwnProperty.call(arr, i)) {
                let str = arr[i].toString(16);
                // Pad to two digits, truncate to last two if too long.  Again,
                // I'm not sure what your needs are for the case, you may want
                // to handle errors in some other way.
                str =
                    str.length === 0
                        ? '00'
                        : str.length === 1
                          ? `0${str}`
                          : str.length === 2
                            ? str
                            : str.substring(str.length - 2, str.length);

                str = str.toUpperCase();
                if (format && str === '2B') {
                    str = ' 2B';
                } // seperate commands with leading space
                if (format && str === '2D') {
                    str = ' !!!2D!!! ';
                } // mark stop/escape byte
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
        result =
            result.length === 0
                ? '00'
                : result.length === 1
                  ? `0${result}`
                  : result.length === 2
                    ? result
                    : result.substring(result.length - 2, result.length);

        return result;
    }
};
