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

    name = name.replace(/\]/g, '');

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
    __client = net.createConnection({ host, port: 8899 });

    if (DEBUG_CONSOLE) {
        __client.on('close', () => {
            // successful connection close
            iobInstance.log.debug(`RCT: Interval connection to inverter at ${host} closed`);
        });
        __client.on('end', () => {
            // closing connection to inverter
            iobInstance.log.debug(`RCT: Terminating interval connection to inverter at ${host}`);
        });
    }

    let pendingEscape = false;
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
        __reconnect = iobInstance.setTimeout(() => rct.reconnect(host, iobInstance), 3000);
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
        if (DEBUG_CONSOLE) {
            iobInstance.log.debug(`DEBUG raw data received: + ${data.toString('hex')}`);
        }

        let unescaped = [];
        let i = 0;

        // Checking packet for escape byte
        if (pendingEscape) {
            const firstByte = data[0];
            if (firstByte === rct.const.start_byte_value || firstByte === rct.const.stop_byte_value) {
                // Discarding escape byte and saving the current byte:
                unescaped.push(firstByte);
            } else {
                // No escape byte, using complete packet:
                unescaped.push(rct.const.stop_byte_value);
                unescaped.push(firstByte);
            }
            pendingEscape = false;
            i = 1;
        }

        // Handling data packet
        while (i < data.length) {
            const currentByte = data[i];

            if (currentByte === rct.const.stop_byte_value) {
                // Break if this is the RCT stop-byte
                if (i === data.length - 1) {
                    pendingEscape = true;
                    break;
                }

                const nextByte = data[i + 1];
                if (nextByte === rct.const.start_byte_value || nextByte === rct.const.stop_byte_value) {
                    unescaped.push(nextByte);
                    i += 2; // Data packet completely handled
                    continue;
                }
            }

            unescaped.push(currentByte);
            i++;
        }

        // Appending checked bytes to buffer
        dataBuffer = Buffer.concat([dataBuffer, Buffer.from(unescaped)]);
        handleData();
    });

    function handleData() {
        // Using a loop to empty buffer until no data left
        while (true) {
            // Skip everything before RCT start-byte '+' (ASCII 43)
            while (dataBuffer.length && dataBuffer[0] !== 43) {
                if (dataBuffer[0] !== 0) {
                    if (DEBUG_CONSOLE) {
                        iobInstance.log.debug('DEBUG: skipping', dataBuffer[0]);
                    }
                }
                dataBuffer = dataBuffer.slice(1);
            }

            // Break if size smaller than minimum size for a RCT packet (5 bytes: header + minimum payload)
            if (dataBuffer.length < 5) {
                return;
            }

            // Check expected frame length
            const frameLength = getFrameLength(dataBuffer);

            // Sanity-check against corrupt length data in header bytes
            if (frameLength > 2048 || frameLength < 5) {
                if (DEBUG_CONSOLE) {
                    iobInstance.log.debug(`DEBUG: Invalid frame length detected (${frameLength}). Dropping sync byte.`);
                }
                dataBuffer = dataBuffer.slice(1);
                continue;
            }

            // If current packet is not completely in buffer yet:
            // break and wait for missing data
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

            // Debug info for completed frames
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(
                    `Processing frame: size=${frameLength}, type=${frameLength === 6 ? 'short' : 'long'}`,
                );
            }

            // Slicing packet from buffer
            const cmdBuffer = dataBuffer.slice(0, frameLength);

            // Parse packet
            const response = parseResponse(cmdBuffer, iobInstance);

            if (response.crcOk) {
                dataBuffer = dataBuffer.slice(frameLength);

                if (response.cmd === 0x01) {
                    if (DEBUG_CONSOLE) {
                        iobInstance.log.debug(`[Echo Filter] Ignored reflected read request for ID ${response.id}`);
                    }
                    continue;
                }

                let txt;
                if (response.description) {
                    txt = `${response.description}: ${response.result} ${response.unit}`;
                } else if (response.name) {
                    txt = `${response.name}: ${response.result} ${response.unit}`;
                } else {
                    txt = response.infoText;
                }

                if (response.name && rctElements.includes(response.name)) {
                    if (DEBUG_CONSOLE) {
                        iobInstance.log.debug(`RCT: received: ${txt}`);
                    }
                    const stateInfo = rct.getStateInfo(response.name, iobInstance);
                    if (stateInfo) {
                        if (response.dataType === 'cell_voltage') {
                            response.result.forEach((r, i) => {
                                iobInstance.setState(
                                    `${stateInfo.stateFullName}_${i}`,
                                    parseFloat(r.V.toFixed(3)),
                                    true,
                                );
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
                // CRC not valid
                dataBuffer = dataBuffer.slice(1);
                const actualLen = cmdBuffer.length; // Length of faulty packet

                // Create CRC error details for faulty packet
                iobInstance.log.debug(
                    `[Stream recovery] False Start detected. Dropped 0x2b. \n` +
                        ` ├─ Extracted frame: ${actualLen} bytes\n` +
                        ` └─ Hex-Dump (Top20): ${cmdBuffer.subarray(0, 20).toString('hex')}`,
                );
            }
        }
    }
};

function getFrameLength(buf) {
    const cmd = buf.readUInt8(1);
    //check for short or long response
    if (cmd === 3 || cmd === 6) {
        return 6 + buf.readUInt16BE(2); // long response
    }
    return 5 + buf.readUInt8(2); // short response
}

function parseResponse(buf, iobInstance) {
    const response = {};

    response.crcOk = buf.slice(-2).readUInt16BE() === rct.crc(buf.slice(1, -2));

    response.cmd = buf.readUInt8(1);

    if (response.cmd === 3 || response.cmd === 6) {
        // long response
        response.length = buf.readUInt16BE(2);
        response.id = byteArray2HexString(buf.slice(4, 8));
        response.data = buf.slice(8, -2);
    } else {
        // short response
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

    let result = 0;
    switch (response.dataType) {
        case 'FLOAT':
            if (response.data.length >= 4) {
                result = response.data.readFloatBE();
            } else {
                if (DEBUG_CONSOLE) {
                    iobInstance.log.warn(
                        `RCT: FLOAT data too short (${response.data.length} bytes) for ID ${response.id}`,
                    );
                }
                result = 0;
            }

            if (response.multiplier !== undefined) {
                result = result * response.multiplier;
            }
            response.result = floatPrecision(result, response.precision);
            break;

        case 'UINT8':
            if (response.data.length >= 1) {
                response.result = response.data.readUInt8();
            } else {
                response.result = 0;
            }
            break;

        case 'INT8':
            if (response.data.length >= 1) {
                response.result = response.data.readInt8();
            } else {
                response.result = 0;
            }
            break;

        case 'UINT16':
            if (response.data.length >= 2) {
                response.result = response.data.readUInt16BE();
            } else {
                response.result = 0;
            }
            break;

        case 'INT16':
            if (response.data.length >= 2) {
                response.result = response.data.readInt16BE();
            } else {
                response.result = 0;
            }
            break;

        case 'UINT32':
            if (response.data.length >= 4) {
                response.result = response.data.readUInt32BE();
            } else {
                response.result = 0;
            }
            break;

        case 'INT32':
            if (response.data.length >= 4) {
                response.result = response.data.readInt32BE();
            } else {
                response.result = 0;
            }
            break;

        case 'STRING':
            response.result = response.data.toString('utf8').replace(/\0/g, '');
            break;

        case 'cell_voltage':
            response.result = decodeRCTCells(response.data);
            break;

        case 'RAW':
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(`RAW response for ${response.name}`);
                iobInstance.log.debug(`Hex Dump: ${response.data.toString('hex')}`);
            }
            response.result = response.data.toString('hex');
            break;

        case 'ENUM':
            response.result = '';
            break;

        default:
            response.result = '';
            break;
    }

    // iobInstance.log.debug("DEBUG response:",response);
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

    const crc = rct.crc(HexString2ByteArray(sTmp));
    baFrame.push(crc >> 8);
    baFrame.push(crc & 0xff);

    return Buffer.from(baFrame);
}

function decodeRCTCells(buffer) {
    const result = [];
    // 4 bytes per value
    const cellCount = Math.floor(buffer.length / 4);

    for (let i = 0; i < cellCount; i++) {
        const offset = i * 4;

        // Reading big Endian uint32
        const value = buffer.readUInt32BE(offset);

        // Scaling
        const mV = value / 256;
        const V = mV / 1000;

        result.push({
            zelle: i + 1,
            rohwert: value,
            mV: mV,
            V: V,
        });
    }

    return result;
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
    for (let i = 0; i < arr.length; i++) {
        let str = arr[i].toString(16).padStart(2, '0').toUpperCase();
        if (format && str === '2B') {
            str = ' 2B';
        }
        if (format && str === '2D') {
            str = ' !!!2D!!! ';
        }
        result += str;
    }
    return result;
}

function byte2HexString(byte) {
    return byte.toString(16).padStart(2, '0').toUpperCase();
}
