const net = require('node:net');
const rct = require('./rct_core2.js');

module.exports = rct;

// flag for local debugging
let DEBUG_CONSOLE = false;

const CELLS_PER_MODULE = 24;
const CELL_STAT_ENTRIES = ['u_min', 'u_max', 't_min', 't_max'];

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
let __consecutiveErrors = 0;

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

function scheduleBackoff(host, rctElements, iobInstance, reason) {
    __consecutiveErrors++;

    const baseRefreshMs = iobInstance.config.rct_refresh * 1000;
    const backoffMs = Math.min(900000, baseRefreshMs * Math.pow(3, __consecutiveErrors - 1));

    if (__consecutiveErrors === 1) {
        iobInstance.log.warn(`RCT: ${reason}. Inverter unreachable. Retrying in ${Math.round(backoffMs / 1000)}s...`);
    } else if (__consecutiveErrors === 2) {
        iobInstance.log.warn(
            `RCT: Inverter still offline (Attempt 2). Confirmed outage. Entering silent nighttime backoff mode.`,
        );
    } else {
        iobInstance.log.debug(
            `RCT: Inverter still offline (Attempt ${__consecutiveErrors}). Next retry in ${Math.round(backoffMs / 1000)}s.`,
        );
    }

    clearTimeout(__reconnect);
    clearInterval(__refreshTimeout);
    __connection = false;
    iobInstance.setState('info.connection', false, true);

    if (__client) {
        try {
            __client.destroy();
        } catch {
            // ignore
        }
        __client = null;
    }

    __refreshTimeout = iobInstance.setTimeout(() => rct.process(host, rctElements, iobInstance), backoffMs);
}

rct.process = function (host, rctElements, iobInstance) {
    if (__client && !__client.destroyed) {
        scheduleBackoff(host, rctElements, iobInstance, 'Previous connection hung');
        return;
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
        if (__consecutiveErrors > 0) {
            iobInstance.log.info(
                `RCT: Inverter is back online! (Recovered automatically after ${__consecutiveErrors} failed attempts)`,
            );
            __consecutiveErrors = 0;
        }

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
        scheduleBackoff(host, rctElements, iobInstance, `Network error (${err.code || 'REFUSED'})`);
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

            // 43 = '+', 1 = read command, 4 = length (0 Payload Bytes)
            // In case the inverter mirrors our read request, delete it
            if (dataBuffer[0] === 43 && dataBuffer[1] === 1 && dataBuffer[2] === 4) {
                if (dataBuffer.length >= 9) {
                    const echoedId = byteArray2HexString(dataBuffer.slice(3, 7));
                    if (DEBUG_CONSOLE) {
                        iobInstance.log.debug(`[Echo Filter] Dropped reflected read request for ID ${echoedId}`);
                    }
                    dataBuffer = dataBuffer.slice(9);
                    continue;
                }
            }
            // ----------------------------------------------

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

            const cmdBuffer = dataBuffer.slice(0, frameLength);
            const response = parseResponse(cmdBuffer, iobInstance);

            if (response.crcOk) {
                dataBuffer = dataBuffer.slice(frameLength);

                const value = typeof response.result === 'object' ? JSON.stringify(response.result) : response.result;
                let txt;
                if (response.description) {
                    txt = `${response.description}: ${value} ${response.unit}`;
                } else if (response.name) {
                    txt = `${response.name}: ${value} ${response.unit}`;
                } else {
                    txt = response.infoText;
                }

                if (response.name && rctElements.includes(response.name)) {
                    if (DEBUG_CONSOLE) {
                        iobInstance.log.debug(`RCT: received: ${txt}`);
                    }
                    const stateInfo = rct.getStateInfo(response.name, iobInstance);
                    if (stateInfo && response.result === undefined) {
                        // invalid payload (wrong length) - keep last valid value instead of writing 0
                        iobInstance.log.debug(
                            `RCT: discarded ${response.name}: unexpected data length ${response.data.length} (${response.data.toString('hex')})`,
                        );
                    } else if (stateInfo && rct.getSubStates(response.dataType)) {
                        // composite types: result maps state suffix -> value
                        for (const [suffix, v] of Object.entries(response.result)) {
                            iobInstance.setState(`${stateInfo.stateFullName}${suffix}`, v, true);
                        }
                    } else if (stateInfo) {
                        iobInstance.setState(stateInfo.stateFullName, response.result, true);
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
                if (DEBUG_CONSOLE) {
                    iobInstance.log.debug(
                        `[Stream recovery] False Start detected. Dropped 0x2b. \n` +
                            ` ├─ Extracted frame: ${actualLen} bytes\n` +
                            ` └─ Hex-Dump (Top20): ${cmdBuffer.subarray(0, 20).toString('hex')}`,
                    );
                }
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

    // payload length must match the data type exactly (same as rctclient); otherwise the frame is discarded
    const expectedLength = DATA_LENGTH[response.dataType];
    if (expectedLength !== undefined && response.data.length !== expectedLength) {
        return response;
    }

    switch (response.dataType) {
        case 'FLOAT': {
            let result = response.data.readFloatBE();
            if (response.multiplier !== undefined) {
                result = result * response.multiplier;
            }
            response.result = floatPrecision(result, response.precision);
            break;
        }

        case 'BOOL':
            response.result = response.data.readUInt8() !== 0;
            break;

        case 'UINT8':
        case 'ENUM':
            response.result = response.data.readUInt8();
            break;

        case 'INT8':
            response.result = response.data.readInt8();
            break;

        case 'UINT16':
            response.result = response.data.readUInt16BE();
            break;

        case 'INT16':
            response.result = response.data.readInt16BE();
            break;

        case 'UINT32':
            response.result = response.data.readUInt32BE();
            break;

        case 'INT32':
            response.result = response.data.readInt32BE();
            break;

        case 'STRING': {
            // string ends at the first \0, anything behind it is padding / garbage
            const end = response.data.indexOf(0);
            response.result = response.data.toString('utf8', 0, end === -1 ? response.data.length : end);
            break;
        }

        case 'cell_voltage':
            response.result = decodeRCTCells(response.data);
            break;

        case 'cell_resist':
            response.result = decodeRCTCellResistances(response.data);
            break;

        case 'cell_stat':
            response.result = decodeRCTCellStatistics(response.data);
            break;

        case 'RAW':
            if (DEBUG_CONSOLE) {
                iobInstance.log.debug(`RAW response for ${response.name}`);
                iobInstance.log.debug(`Hex Dump: ${response.data.toString('hex')}`);
            }
            response.result = response.data.toString('hex');
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

// expected payload length in bytes per data type
const DATA_LENGTH = {
    BOOL: 1,
    UINT8: 1,
    INT8: 1,
    ENUM: 1,
    UINT16: 2,
    INT16: 2,
    UINT32: 4,
    INT32: 4,
    FLOAT: 4,
    cell_voltage: CELLS_PER_MODULE * 4,
    cell_resist: CELLS_PER_MODULE * 4,
    cell_stat: 48,
};

/**
 * Returns the sub states (suffix and unit) a composite data type is written to, or null for simple types.
 *
 * @param {string} rctType data type from rct.cmdReverse
 * @returns {Array<{suffix: string, unit: string}> | null} sub states
 */
rct.getSubStates = function (rctType) {
    const cells = [...Array(CELLS_PER_MODULE).keys()];
    switch (rctType) {
        case 'cell_voltage':
            return [
                ...cells.map(i => ({ suffix: `_${i}`, unit: 'V' })),
                ...cells.map(i => ({ suffix: `_temp_${i}`, unit: '°C' })),
            ];
        case 'cell_resist':
            return cells.map(i => ({ suffix: `_${i}`, unit: 'mΩ' }));
        case 'cell_stat':
            // same state names as the single objects battery.cells_stat[n].u_min.index etc.
            return CELL_STAT_ENTRIES.flatMap(e => [
                { suffix: `_${e}_index`, unit: '' },
                { suffix: `_${e}_time`, unit: '' },
                { suffix: `_${e}_value`, unit: e.startsWith('u') ? 'V' : '°C' },
            ]);
        default:
            return null;
    }
};

function decodeRCTCells(buffer) {
    const result = {};
    // 4 bytes per cell: temperature (uint8, °C), voltage (uint16 little-endian, mV), status byte
    for (let i = 0; i < CELLS_PER_MODULE; i++) {
        const offset = i * 4;
        result[`_${i}`] = buffer.readUInt16LE(offset + 1) / 1000;
        result[`_temp_${i}`] = buffer.readUInt8(offset);
    }
    return result;
}

function decodeRCTCellResistances(buffer) {
    const result = {};
    // 4 bytes per cell: big-endian uint16 in 1/256 mOhm, followed by 2 padding bytes
    for (let i = 0; i < CELLS_PER_MODULE; i++) {
        result[`_${i}`] = floatPrecision(buffer.readUInt16BE(i * 4) / 256, 3);
    }
    return result;
}

function decodeRCTCellStatistics(buffer) {
    const result = {};
    // 4 entries (u_min, u_max, t_min, t_max) of 3 little-endian values: cell index (uint32), timestamp (uint32), value (float)
    CELL_STAT_ENTRIES.forEach((e, n) => {
        const offset = n * 12;
        result[`_${e}_index`] = buffer.readUInt32LE(offset);
        result[`_${e}_time`] = buffer.readUInt32LE(offset + 4);
        result[`_${e}_value`] = floatPrecision(buffer.readFloatLE(offset + 8), e.startsWith('u') ? 3 : 1);
    });
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
