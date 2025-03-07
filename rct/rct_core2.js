//Liste der Kommandos vervollständigt.

const rct = {};

rct.crc = function (byteArray, previous) {
    // console.log('DEBUG CRC:',byteArray);

    let bit, c15;

    let crc = typeof previous !== 'undefined' ? ~~previous : 0xffff;

    if (byteArray.length % 2) {
        //console.log('DEBUG: rct.crc() adjust byteArray', byteArray);
        if (byteArray.push) {
            byteArray.push(0);
        } else {
            byteArray = Buffer.concat([byteArray, Buffer.from([0])]);
        }
    }

    for (let index = 0; index < byteArray.length; index++) {
        const byte = byteArray[index];
        for (let i = 0; i < 8; i++) {
            bit = ((byte >> (7 - i)) & 1) == 1;
            c15 = ((crc >> 15) & 1) == 1;
            crc <<= 1;
            if (c15 ^ bit) {
                crc ^= 0x1021;
            }
        }
        crc &= 0xffff;
    }
    return crc;
};

rct.const = {
    start_byte: '2B',
    start_byte_value: 43,
    stop_byte: '2D',
    stop_byte_value: 45,
    command_byte_read: '01 ',
    command_byte_write: '02 ',
    command_byte_longwrite: '03 ',
    command_byte_reserved: '04 ',
    command_byte_response: '05 ',
    command_byte_longresponse: '06 ',
    command_byte_extension: '3C',
};

rct.inverter_state = {
    0: 'Standby',
    1: 'Initialization',
    2: 'Standby',
    3: 'Efficiency (debug state for development purposes)',
    4: 'Insulation check',
    5: 'Island check (decision where to go - grid connected or island)',
    6: 'Power check (decision if enougth energy to start or not',
    7: 'Symmetry (DC-link alignment',
    8: 'Relays test',
    9: 'Grid Passive (inverter get power from grid without bridge clocking',
    10: 'Prepare Bat passive',
    11: 'Battery passice (off-grid)',
    12: 'Hardwaretest',
    13: 'Einspeisung',
};

rct.battery_state = {
    0: 'normal mode/idle',
    1: 'idle (no CAN-connection to inverter)',
    3: 'Update?',
    5: 'Start ?',
    8: 'calibrating - charging phase (0% --> 100%)',
    1024: 'calibrating - discharge phase (xx% --> 0%)',
    2048: 'balancing',
};

rct.cmd = {};

rct.cmd['acc_conv.i_acc_lp_fast'] = { serial: 0, id: '0AFDD6CF' };
rct.cmd['acc_conv.i_charge_max'] = { serial: 0, id: 'B0FA4D23' };
rct.cmd['acc_conv.i_acc_lp_slow'] = { serial: 0, id: 'B408E40A' };
rct.cmd['acc_conv.i_discharge_max'] = { serial: 0, id: 'C642B9D6' };
rct.cmd['acc_conv.state_slow'] = { serial: 0, id: 'D9F9F35B' };
rct.cmd['acc_conv.i_max'] = { serial: 0, id: 'E3F4D1DF' };
rct.cmd['adc.u_ref_1_5v[0]'] = { serial: 0, id: '07C61FAD' };
rct.cmd['adc.u_ref_1_5v[1]'] = { serial: 0, id: '16B28CCA' };
rct.cmd['adc.u_ref_1_5v[3]'] = { serial: 0, id: '508FCE78' };
rct.cmd['adc.u_ref_1_5v[2]'] = { serial: 0, id: '715C84A1' };
rct.cmd['adc.u_acc'] = { serial: 0, id: 'B84FDCF9' };
rct.cmd['bat_mng_struct.profile_pdc_max'] = { serial: 0, id: '3B0C6A53' };
rct.cmd['bat_mng_struct.bat_calib_soc_thresh'] = { serial: 0, id: '3E25C391' };
rct.cmd['bat_mng_struct.k_trust'] = { serial: 0, id: 'B2FB9A90' };
rct.cmd['bat_mng_struct.profile_pext'] = { serial: 0, id: 'DE68F62D' };
rct.cmd['bat_mng_struct.profile_pdc'] = { serial: 0, id: 'DF6EA121' };
rct.cmd['bat_mng_struct.k'] = { serial: 0, id: 'F0A03A20' };
rct.cmd['bat_mng_struct.knpm _reserve'] = { serial: 0, id: 'F644DCA7' };
rct.cmd['bat_mng_struct.count'] = { serial: 0, id: 'FB57BA65' };
rct.cmd['bat_mng_struct.bat_calib_soc_threshold'] = { serial: 0, id: 'FC5AA529' };
rct.cmd['battery.cells_stat[0].u_max.value'] = { serial: 0, id: '03D9C51F' };
rct.cmd['battery.cells_stat[4].u_min.time'] = { serial: 0, id: '056162CA' };
rct.cmd['battery.cells_stat[3].t_max.index'] = { serial: 0, id: '056417DF' };
rct.cmd['battery.cells_stat[4].t_max.index'] = { serial: 0, id: '064A60FE' };
rct.cmd['battery.charged_amp_hours'] = { serial: 0, id: '06A9FFA2' };
rct.cmd['battery.cells_stat[4].u_max.index'] = { serial: 0, id: '077692DE' };
rct.cmd['battery.stack_software_version[3]'] = { serial: 0, id: '086C75B0' };
rct.cmd['battery.cells_stat[3].t_min.index'] = { serial: 0, id: '09923C1E' };
rct.cmd['battery.stack_cycles[1]'] = { serial: 0, id: '0CFA8BC4' };
rct.cmd['battery.status2'] = { serial: 0, id: '0DE3D20D' };
rct.cmd['battery.cells_stat[3].u_max.value'] = { serial: 0, id: '0EF60C7E' };
rct.cmd['battery.cells_stat[4].u_min.index'] = { serial: 0, id: '120EC3B4' };
rct.cmd['battery.module_sn[5]'] = { serial: 0, id: '162491E8' };
rct.cmd['battery.bms_sn'] = { serial: 0, id: '16A1F844' };
rct.cmd['battery.cells_stat[5].u_max.index'] = { serial: 0, id: '18D1E9E0' };
rct.cmd['battery.cells_stat[3].u_min.value'] = { serial: 0, id: '18F98B6D' };
rct.cmd['battery.bms_power_version'] = { serial: 0, id: '1B39A3A3' };
rct.cmd['battery.maximum_charge_current'] = { serial: 0, id: '1E5FCA70' };
rct.cmd['battery.cells_stat[3].t_max.time'] = { serial: 0, id: '1F73B6A4' };
rct.cmd['battery.current'] = { serial: 0, id: '21961B58' };
rct.cmd['battery.cells_stat[2].u_min.index'] = { serial: 0, id: '257B5945' };
rct.cmd['battery.module_sn[3]'] = { serial: 0, id: '257B7612' };
rct.cmd['battery.cells_stat[1].t_max.index'] = { serial: 0, id: '26363AAE' };
rct.cmd['battery.cells_stat[2].t_max.time'] = { serial: 0, id: '265EACF6' };
rct.cmd['battery.stack_cycles[6]'] = { serial: 0, id: '27C39CEA' };
rct.cmd['battery.stack_cycles[5]'] = { serial: 0, id: '2A30A97E' };
rct.cmd['battery.max_cell_voltage'] = { serial: 0, id: '2AACCAA7' };
rct.cmd['battery.discharged_amp_hours'] = { serial: 0, id: '2BC1E72B' };
rct.cmd['battery.cells_stat[2].t_max.value'] = { serial: 0, id: '331D0689' };
rct.cmd['battery.cells_stat[0].t_max.time'] = { serial: 0, id: '336415EA' };
rct.cmd['battery.cells_stat[2].u_max.index'] = { serial: 0, id: '34E33726' };
rct.cmd['battery.cells_stat[3].u_max.time'] = { serial: 0, id: '3503B92D' };
rct.cmd['battery.soh'] = { serial: 0, id: '381B8BF9' };
rct.cmd['battery.cells_stat[1].u_max.value'] = { serial: 0, id: '3A7D5F53' };
rct.cmd['battery.cells_stat[3].t_min.value'] = { serial: 0, id: '3BA1B77B' };
rct.cmd['battery.cells_stat[5].t_max.index'] = { serial: 0, id: '3F98F58A' };
rct.cmd['battery.cells_stat[3].u_min.index'] = { serial: 0, id: '41B11ECF' };
rct.cmd['battery.cells_stat[5].u_min.value'] = { serial: 0, id: '428CCF46' };
rct.cmd['battery.cells_stat[4].t_min.time'] = { serial: 0, id: '442A3409' };
rct.cmd['battery.cells_stat[0].t_max.index'] = { serial: 0, id: '4443C661' };
rct.cmd['battery.prog_sn'] = { serial: 0, id: '4B51A539' };
rct.cmd['battery.min_cell_voltage'] = { serial: 0, id: '4CB7C0DC' };
rct.cmd['battery.cells_stat[5].u_max.value'] = { serial: 0, id: '4D985F33' };
rct.cmd['battery.soc_update_since'] = { serial: 0, id: '4E04DD55' };
rct.cmd['battery.module_sn[4]'] = { serial: 0, id: '4E699086' };
rct.cmd['battery.cells_resist[5]'] = { serial: 0, id: '501A162D' };
rct.cmd['battery.cells_stat[6].u_min.index'] = { serial: 0, id: '50514732' };
rct.cmd['battery.cells_stat[5].u_min.time'] = { serial: 0, id: '518C7BBE' };
rct.cmd['battery.cells_stat[0].t_max.value'] = { serial: 0, id: '537C719F' };
rct.cmd['battery.stored_energy'] = { serial: 0, id: '5570401B' };
rct.cmd['battery.max_cell_temperature'] = { serial: 0, id: '55DDF7BA' };
rct.cmd['battery.maximum_charge_voltage_constant_u'] = { serial: 0, id: '5847E59E' };
rct.cmd['battery.module_sn[6]'] = { serial: 0, id: '5939EC5D' };
rct.cmd['battery.cells_stat[1].t_max.time'] = { serial: 0, id: '5A120CE4' };
rct.cmd['battery.stack_cycles[4]'] = { serial: 0, id: '5A9EEFF0' };
rct.cmd['battery.cells_stat[4].t_min.value'] = { serial: 0, id: '5AF50FD7' };
rct.cmd['battery.stack_cycles[2]'] = { serial: 0, id: '5BA122A5' };
rct.cmd['battery.cells_stat[6].u_min.time'] = { serial: 0, id: '60749E5E' };
rct.cmd['battery.cells_stat[0].t_min.value'] = { serial: 0, id: '61EAC702' };
rct.cmd['battery.cells_stat[6].u_min.value'] = { serial: 0, id: '6213589B' };
rct.cmd['battery.stack_software_version[0]'] = { serial: 0, id: '6388556C' };
rct.cmd['battery.cells_stat[1].u_min.index'] = { serial: 0, id: '6445D856' };
rct.cmd['battery.cells_resist[0]'] = { serial: 0, id: '649B10DA' };
rct.cmd['battery.voltage'] = { serial: 0, id: '65EED11B' };
rct.cmd['battery.stack_software_version[6]'] = { serial: 0, id: '6974798A' };
rct.cmd['battery.cells_stat[4].u_min.value'] = { serial: 0, id: '6DB1FDDC' };
rct.cmd['battery.cells_stat[5].u_max.time'] = { serial: 0, id: '6E24632E' };
rct.cmd['battery.maximum_charge_voltage'] = { serial: 0, id: '6E491B50' };
rct.cmd['battery.cells_stat[1].t_min.index'] = { serial: 0, id: '70349444' };
rct.cmd['battery.bat_status'] = { serial: 0, id: '70A2AF4F' };
rct.cmd['battery.cells_stat[5].t_min.index'] = { serial: 0, id: '71196579' };
rct.cmd['battery.status'] = { serial: 0, id: '71765BD8' };
rct.cmd['battery.cells_resist[1]'] = { serial: 0, id: '71CB0B57' };
rct.cmd['battery.inv_cmd'] = { serial: 0, id: '7268CE4D' };
rct.cmd['battery.module_sn[2]'] = { serial: 0, id: '73489528' };
rct.cmd['battery.cells_stat[0].u_max.index'] = { serial: 0, id: '770A6E7C' };
rct.cmd['battery.cells_stat[0].u_max.time'] = { serial: 0, id: '7E590128' };
rct.cmd['battery.cells_stat[6].u_max.index'] = { serial: 0, id: '7F42BB82' };
rct.cmd['battery.cells_stat[5].t_max.time'] = { serial: 0, id: '7FF6252C' };
rct.cmd['battery.cells_stat[6].u_max.value'] = { serial: 0, id: '804A3266' };
rct.cmd['battery.cells_stat[4].t_max.value'] = { serial: 0, id: '8160539D' };
rct.cmd['battery.cells_stat[6].t_min.value'] = { serial: 0, id: '885BB57E' };
rct.cmd['battery.cells_stat[0].u_min.value'] = { serial: 0, id: '889DC27F' };
rct.cmd['battery.cells_stat[5].t_min.value'] = { serial: 0, id: '88BBF8CB' };
rct.cmd['battery.stack_cycles[3]'] = { serial: 0, id: '89B25F4B' };
rct.cmd['battery.soc_target'] = { serial: 0, id: '8B9FF008' };
rct.cmd['battery.cells_stat[6].t_min.time'] = { serial: 0, id: '8BB08839' };
rct.cmd['battery.cells_stat[3].u_min.time'] = { serial: 0, id: '8DFFDD33' };
rct.cmd['battery.cells_stat[4].u_max.time'] = { serial: 0, id: '8EC23427' };
rct.cmd['battery.cells_stat[6].t_max.time'] = { serial: 0, id: '8EF9C9B8' };
rct.cmd['battery.temperature'] = { serial: 0, id: '902AFAFB' };
rct.cmd['battery.cells_stat[1].u_max.time'] = { serial: 0, id: '90832471' };
rct.cmd['battery.cells_stat[0].t_min.time'] = { serial: 0, id: '91C325D9' };
rct.cmd['battery.cells_stat[6].t_max.value'] = { serial: 0, id: '91FB68CD' };
rct.cmd['battery.soc'] = { serial: 0, id: '959930BF' };
rct.cmd['battery.module_sn[1]'] = { serial: 0, id: '99396810' };
rct.cmd['battery.cells_resist[3]'] = { serial: 0, id: '993C06F6' };
rct.cmd['battery.bms_software_version'] = { serial: 0, id: '9D785E8C' };
rct.cmd['battery.cells_stat[2].u_max.time'] = { serial: 0, id: '9E314430' };
rct.cmd['battery.min_cell_temperature'] = { serial: 0, id: 'A10D9A4B' };
rct.cmd['battery.cells_stat[2].t_min.value'] = { serial: 0, id: 'A3E48B21' };
rct.cmd['battery.stack_software_version[4]'] = { serial: 0, id: 'A40906BF' };
rct.cmd['battery.stack_software_version[1]'] = { serial: 0, id: 'A54C4685' };
rct.cmd['battery.soc_target_low'] = { serial: 0, id: 'A616B022' };
rct.cmd['battery.cells_stat[4].t_min.index'] = { serial: 0, id: 'A6871A4D' };
rct.cmd['battery.stack_cycles[0]'] = { serial: 0, id: 'A6C4FD4A' };
rct.cmd['battery.cells_stat[2].t_max.index'] = { serial: 0, id: 'A7DBD28C' };
rct.cmd['battery.cells_stat[2].t_min.index'] = { serial: 0, id: 'A7FE5C0C' };
rct.cmd['battery.used_energy'] = { serial: 0, id: 'A9033880' };
rct.cmd['battery.cells_stat[4].t_max.time'] = { serial: 0, id: 'AACAC898' };
rct.cmd['battery.efficiency'] = { serial: 0, id: 'ACF7666B' };
rct.cmd['battery.minimum_discharge_voltage'] = { serial: 0, id: 'B0EBE75A' };
rct.cmd['battery.cells_stat[1].u_min.value'] = { serial: 0, id: 'B4E053D4' };
rct.cmd['battery.ah_capacity'] = { serial: 0, id: 'B57B59BD' };
rct.cmd['battery.cells_stat[2].u_min.time'] = { serial: 0, id: 'B81FB399' };
rct.cmd['battery.soc_target_high'] = { serial: 0, id: 'B84A38AB' };
rct.cmd['battery.cells_stat[5].u_min.index'] = { serial: 0, id: 'B9E09F78' };
rct.cmd['battery.cells_stat[1].t_min.time'] = { serial: 0, id: 'BB302278' };
rct.cmd['battery.cells_stat[6].t_max.index'] = { serial: 0, id: 'BDE3BF0A' };
rct.cmd['battery.cells_stat[2].t_min.time'] = { serial: 0, id: 'C0680302' };
rct.cmd['battery.cycles'] = { serial: 0, id: 'C0DF2978' };
rct.cmd['battery.cells_stat[1].u_max.index'] = { serial: 0, id: 'C42F5807' };
rct.cmd['battery.cells_stat[6].u_max.time'] = { serial: 0, id: 'C6DA81A0' };
rct.cmd['battery.cells_stat[0].u_min.time'] = { serial: 0, id: 'C88EB032' };
rct.cmd['battery.stack_software_version[2]'] = { serial: 0, id: 'C8BA1729' };
rct.cmd['battery.cells_stat[1].t_min.value'] = { serial: 0, id: 'D0C47326' };
rct.cmd['battery.cells_stat[1].u_min.time'] = { serial: 0, id: 'D60E7A2F' };
rct.cmd['battery.cells_stat[0].t_min.index'] = { serial: 0, id: 'DD5930A2' };
rct.cmd['battery.cells_stat[5].t_max.value'] = { serial: 0, id: 'DE9CBCB0' };
rct.cmd['battery.cells_resist[4]'] = { serial: 0, id: 'DEE1957F' };
rct.cmd['battery.maximum_discharge_current'] = { serial: 0, id: 'DF0A735C' };
rct.cmd['battery.cells_stat[6].t_min.index'] = { serial: 0, id: 'DFF966E3' };
rct.cmd['battery.cells_stat[2].u_max.value'] = { serial: 0, id: 'E7177DEE' };
rct.cmd['battery.bat_impedance.impedance_fine'] = { serial: 0, id: 'E7B0E692' };
rct.cmd['battery.minimum_discharge_voltage_constant_u'] = { serial: 0, id: 'EA77252E' };
rct.cmd['battery.cells_resist[6]'] = { serial: 0, id: 'EB4C2597' };
rct.cmd['battery.stack_software_version[5]'] = { serial: 0, id: 'EEA3F59B' };
rct.cmd['battery.cells_stat[2].u_min.value'] = { serial: 0, id: 'EECDFEFC' };
rct.cmd['battery.cells_stat[5].t_min.time'] = { serial: 0, id: 'EFD3EC8A' };
rct.cmd['battery.cells_stat[3].t_max.value'] = { serial: 0, id: 'F044EDA0' };
rct.cmd['battery.cells_stat[1].t_max.value'] = { serial: 0, id: 'F257D342' };
rct.cmd['battery.cells_resist[2]'] = { serial: 0, id: 'F3FD8CE6' };
rct.cmd['battery.cells_stat[4].u_max.value'] = { serial: 0, id: 'F54BC06D' };
rct.cmd['battery.cells_stat[3].t_min.time'] = { serial: 0, id: 'FA3276DC' };
rct.cmd['battery.module_sn[0]'] = { serial: 0, id: 'FBF6D834' };
rct.cmd['battery.cells_stat[3].u_max.index'] = { serial: 0, id: 'FDBD9EE9' };
rct.cmd['battery.cells_stat[0].u_min.index'] = { serial: 0, id: 'FE44BA26' };
rct.cmd['buf_v_control.power_reduction_max_solar'] = { serial: 0, id: '4BC0F974' };
rct.cmd['buf_v_control.power_reduction_max_solar_grid'] = { serial: 0, id: 'F473BC5E' };
rct.cmd['buf_v_control.power_reduction'] = { serial: 0, id: 'FE1AA500' };
rct.cmd['can_bus.bms_update_response[0]'] = { serial: 0, id: '4539A6D4' };
rct.cmd['can_bus.requested_id'] = { serial: 0, id: '69AA598A' };
rct.cmd['can_bus.bms_update_response[1]'] = { serial: 0, id: '7A67E33B' };
rct.cmd['can_bus.bms_update_state'] = { serial: 0, id: '96629BB9' };
rct.cmd['can_bus.set_cell_resist'] = { serial: 0, id: 'BD4147B0' };
rct.cmd['can_bus.set_cell_v_t'] = { serial: 0, id: 'D143A391' };
rct.cmd['cs_map[1]'] = { serial: 0, id: '6D5318C8' };
rct.cmd['cs_map[2]'] = { serial: 0, id: 'D451EF88' };
rct.cmd['cs_map[0]'] = { serial: 0, id: 'E0E16E63' };
rct.cmd['cs_neg[2]'] = { serial: 0, id: '019C0B60' };
rct.cmd['cs_neg[1]'] = { serial: 0, id: '4C12C4C7' };
rct.cmd['cs_neg[0]'] = { serial: 0, id: '82258C01' };
rct.cmd['db.power_board.Current_Mean'] = { serial: 0, id: '16AF2A92' };
rct.cmd['db.power_board.adc_p9V_meas'] = { serial: 0, id: '17E3AF97' };
rct.cmd['db.power_board.Calibr_Value_Mean'] = { serial: 0, id: '1F9CBBF2' };
rct.cmd['db.power_board.afi_t300'] = { serial: 0, id: '2ED89924' };
rct.cmd['db.power_board.afi_i60'] = { serial: 0, id: '383A3614' };
rct.cmd['db.power_board.relays_state'] = { serial: 0, id: '3EFEB931' };
rct.cmd['db.power_board.afi_t60'] = { serial: 0, id: '43FF47C3' };
rct.cmd['db.temp2'] = { serial: 0, id: '4F735D10' };
rct.cmd['db.power_board.afi_t150'] = { serial: 0, id: '5CD75669' };
rct.cmd['db.power_board.version_boot'] = { serial: 0, id: '6279F2A3' };
rct.cmd['db.power_board.afi_i30'] = { serial: 0, id: '6BA10831' };
rct.cmd['db.power_board.afi_i150'] = { serial: 0, id: '6FB2E2BF' };
rct.cmd['db.power_board.afi_i300'] = { serial: 0, id: '742966A6' };
rct.cmd['db.power_board.version_main'] = { serial: 0, id: '7DA7D8B6' };
rct.cmd['db.power_board.adc_p5V_W_meas'] = { serial: 0, id: '80835476' };
rct.cmd['db.power_board.adc_m9V_meas'] = { serial: 0, id: '9981F1AC' };
rct.cmd['db.power_board.status'] = { serial: 0, id: 'B0307591' };
rct.cmd['db.power_board.Current_AC_RMS'] = { serial: 0, id: 'B69171C4' };
rct.cmd['db.power_board.afi_t30'] = { serial: 0, id: 'C0B7C4D2' };
rct.cmd['db.core_temp'] = { serial: 0, id: 'C24E85D0' };
rct.cmd['db.power_board.Current_Mean_Mean_AC'] = { serial: 0, id: 'DFB53AF3' };
rct.cmd['db.power_board.adc_p3V3_meas'] = { serial: 0, id: 'F0527539' };
rct.cmd['db.temp1'] = { serial: 0, id: 'F79D41D9' };
rct.cmd['dc_conv.dc_conv_struct[1].p_dc_lp'] = { serial: 0, id: '0CB5D21B' };
rct.cmd['dc_conv.dc_conv_struct[0].u_target'] = { serial: 0, id: '226A23A4' };
rct.cmd['dc_conv.dc_conv_struct[1].mpp.mpp_step'] = { serial: 0, id: '4AE96C12' };
rct.cmd['dc_conv.dc_conv_struct[1].u_sg_lp'] = { serial: 0, id: '5BB8075A' };
rct.cmd['dc_conv.dc_conv_struct[1].mpp.fixed_voltage'] = { serial: 0, id: '5E942C62' };
rct.cmd['dc_conv.start_voltage'] = { serial: 0, id: '62B8940B' };
rct.cmd['dc_conv.dc_conv_struct[1].u_target'] = { serial: 0, id: '675776B1' };
rct.cmd['dc_conv.dc_conv_struct[0].mpp.fixed_voltage'] = { serial: 0, id: '9E1A88F5' };
rct.cmd['dc_conv.dc_conv_struct[1].p_dc'] = { serial: 0, id: 'AA9AA253' };
rct.cmd['dc_conv.dc_conv_struct[0].u_sg_lp'] = { serial: 0, id: 'B298395D' };
rct.cmd['dc_conv.dc_conv_struct[0].p_dc'] = { serial: 0, id: 'B5317B78' };
rct.cmd['dc_conv.dc_conv_struct[1].rescan_correction'] = { serial: 0, id: 'B836B50C' };
rct.cmd['dc_conv.dc_conv_struct[0].mpp.mpp_step'] = { serial: 0, id: 'BA8B8515' };
rct.cmd['dc_conv.dc_conv_struct[0].p_dc_lp'] = { serial: 0, id: 'DB11855B' };
rct.cmd['dc_conv.dc_conv_struct[0].rescan_correction'] = { serial: 0, id: 'DB45ABD0' };
rct.cmd['dc_conv.last_rescan'] = { serial: 0, id: 'F87A2A1E' };
rct.cmd['display_struct.brightness'] = { serial: 0, id: '29BDA75F' };
rct.cmd['display_struct.variate_contrast'] = { serial: 0, id: 'C1D051EC' };
rct.cmd['display_struct.contrast'] = { serial: 0, id: 'F247BB16' };
rct.cmd['energy.e_ext_month'] = { serial: 0, id: '031A6110' };
rct.cmd['energy.e_ext_day_sum'] = { serial: 0, id: '0C588B75' };
rct.cmd['energy.e_ext_total_sum'] = { serial: 0, id: '0F28E2E1' };
rct.cmd['energy.e_ac_month'] = { serial: 0, id: '10970E9D' };
rct.cmd['energy.e_grid_load_month'] = { serial: 0, id: '126ABC86' };
rct.cmd['energy.e_grid_load_total_sum'] = { serial: 0, id: '1BFA5A33' };
rct.cmd['energy.e_dc_month_sum[1]'] = { serial: 0, id: '21E1A802' };
rct.cmd['energy.e_dc_day_sum[1]'] = { serial: 0, id: '241F1F98' };
rct.cmd['energy.e_grid_feed_year'] = { serial: 0, id: '26EFFC2F' };
rct.cmd['energy.e_grid_feed_total_sum'] = { serial: 0, id: '27C828F4' };
rct.cmd['energy.e_dc_day[0]'] = { serial: 0, id: '2AE703F2' };
rct.cmd['energy.e_load_day'] = { serial: 0, id: '2F3C1D7D' };
rct.cmd['energy.e_ac_day_sum'] = { serial: 0, id: '3A873343' };
rct.cmd['energy.e_ext_year_sum'] = { serial: 0, id: '3A9D2680' };
rct.cmd['energy.e_grid_feed_day'] = { serial: 0, id: '3C87C4F5' };
rct.cmd['energy.e_grid_feed_total'] = { serial: 0, id: '44D4C533' };
rct.cmd['energy.e_dc_year_sum[0]'] = { serial: 0, id: '495BF0B6' };
rct.cmd['energy.e_load_day_sum'] = { serial: 0, id: '4BE02BB7' };
rct.cmd['energy.e_load_year_sum'] = { serial: 0, id: '4EE8DB78' };
rct.cmd['energy.e_grid_load_total'] = { serial: 0, id: '62FBE7DC' };
rct.cmd['energy.e_grid_feed_month'] = { serial: 0, id: '65B624AB' };
rct.cmd['energy.e_ac_year_sum'] = { serial: 0, id: '6709A2F4' };
rct.cmd['energy.e_dc_total[1]'] = { serial: 0, id: '68EEFD3D' };
rct.cmd['energy.e_dc_year_sum[1]'] = { serial: 0, id: '6CFCD774' };
rct.cmd['energy.e_ext_month_sum'] = { serial: 0, id: '6FF4BD55' };
rct.cmd['energy.e_ac_total_sum'] = { serial: 0, id: '79C0A724' };
rct.cmd['energy.e_dc_month[1]'] = { serial: 0, id: '7AB9B045' };
rct.cmd['energy.e_load_total_sum'] = { serial: 0, id: '7E096024' };
rct.cmd['energy.e_dc_total_sum[1]'] = { serial: 0, id: '812E5ADD' };
rct.cmd['energy.e_dc_month[0]'] = { serial: 0, id: '81AE960B' };
rct.cmd['energy.e_grid_feed_year_sum'] = { serial: 0, id: '84ABE3D8' };
rct.cmd['energy.e_grid_load_day'] = { serial: 0, id: '867DEF7D' };
rct.cmd['energy.e_ext_year'] = { serial: 0, id: '917E3622' };
rct.cmd['energy.e_load_month_sum'] = { serial: 0, id: 'A12BE39C' };
rct.cmd['energy.e_grid_feed_month_sum'] = { serial: 0, id: 'A5341F4A' };
rct.cmd['energy.e_ext_total'] = { serial: 0, id: 'A59C8428' };
rct.cmd['energy.e_dc_year[0]'] = { serial: 0, id: 'AF64D0FE' };
rct.cmd['energy.e_ac_total'] = { serial: 0, id: 'B1EF67CE' };
rct.cmd['energy.e_dc_total_sum[0]'] = { serial: 0, id: 'B7B2967F' };
rct.cmd['energy.e_ext_day'] = { serial: 0, id: 'B9A026F9' };
rct.cmd['energy.e_ac_day'] = { serial: 0, id: 'BD55905F' };
rct.cmd['energy.e_dc_year[1]'] = { serial: 0, id: 'BD55D796' };
rct.cmd['energy.e_ac_year'] = { serial: 0, id: 'C0CC81B6' };
rct.cmd['energy.e_load_year'] = { serial: 0, id: 'C7D3B479' };
rct.cmd['energy.e_dc_day_sum[0]'] = { serial: 0, id: 'C9D76279' };
rct.cmd['energy.e_grid_load_year_sum'] = { serial: 0, id: 'D9D66B76' };
rct.cmd['energy.e_grid_load_month_sum'] = { serial: 0, id: 'DA207111' };
rct.cmd['energy.e_grid_load_year'] = { serial: 0, id: 'DE17F021' };
rct.cmd['energy.e_dc_month_sum[0]'] = { serial: 0, id: 'EAEEB3CA' };
rct.cmd['energy.e_load_total'] = { serial: 0, id: 'EFF4B537' };
rct.cmd['energy.e_load_month'] = { serial: 0, id: 'F0BE6429' };
rct.cmd['energy.e_dc_day[1]'] = { serial: 0, id: 'FBF3CE97' };
rct.cmd['energy.e_grid_load_day_sum'] = { serial: 0, id: 'FBF8D63C' };
rct.cmd['energy.e_ac_month_sum'] = { serial: 0, id: 'FC1C614E' };
rct.cmd['energy.e_dc_total[0]'] = { serial: 0, id: 'FC724A9E' };
rct.cmd['energy.e_grid_feed_day_sum'] = { serial: 0, id: 'FDB81124' };
rct.cmd['fault[1].flt'] = { serial: 0, id: '234B4736' };
rct.cmd['fault[0].flt'] = { serial: 0, id: '37F9D5CA' };
rct.cmd['fault[2].flt'] = { serial: 0, id: '3B7FCD47' };
rct.cmd['fault[3].flt'] = { serial: 0, id: '7F813D73' };
rct.cmd['flash_state'] = { serial: 0, id: '43F16F7E' };
rct.cmd['flash_param.write_cycles'] = { serial: 0, id: '46892579' };
rct.cmd['flash_mem'] = { serial: 0, id: '65A44A98' };
rct.cmd['flash_param.erase_cycles'] = { serial: 0, id: '96E32D11' };
rct.cmd['last_successfull_flash_op'] = { serial: 0, id: 'B238942F' };
rct.cmd['flash_result'] = { serial: 0, id: 'E63A3529' };
rct.cmd['flash_rtc.time_stamp_set'] = { serial: 0, id: '0E0505B4' };
rct.cmd['flash_rtc.rtc_mcc_quartz_max_diff'] = { serial: 0, id: '2266DCB8' };
rct.cmd['flash_rtc.rtc_mcc_quartz_ppm_difference'] = { serial: 0, id: '4E0C56F2' };
rct.cmd['flash_rtc.time_stamp_factory'] = { serial: 0, id: '7301A5A7' };
rct.cmd['flash_rtc.time_stamp'] = { serial: 0, id: 'D166D94D' };
rct.cmd['flash_rtc.time_stamp_update'] = { serial: 0, id: 'DD90A328' };
rct.cmd['grid_lt.threshold'] = { serial: 0, id: '3A3050E6' };
rct.cmd['grid_lt.granularity'] = { serial: 0, id: '9061EA7B' };
rct.cmd['grid_lt.timeframe'] = { serial: 0, id: 'D9E721A5' };
rct.cmd['grid_mon[0].u_over.time'] = { serial: 0, id: '016109E1' };
rct.cmd['grid_mon[1].u_under.time'] = { serial: 0, id: '3044195F' };
rct.cmd['grid_mon[0].u_under.threshold'] = { serial: 0, id: '3CB1EF01' };
rct.cmd['grid_mon[1].f_under.threshold'] = { serial: 0, id: '3E722B43' };
rct.cmd['grid_mon[1].u_over.threshold'] = { serial: 0, id: '5438B68E' };
rct.cmd['grid_mon[0].f_under.time'] = { serial: 0, id: '70E28322' };
rct.cmd['grid_mon[1].u_under.threshold'] = { serial: 0, id: '82CD1525' };
rct.cmd['grid_mon[1].f_over.threshold'] = { serial: 0, id: '915CD4A4' };
rct.cmd['grid_mon[0].f_over.time'] = { serial: 0, id: '933F9A24' };
rct.cmd['grid_mon[0].u_over.threshold'] = { serial: 0, id: 'A6271C2E' };
rct.cmd['grid_mon[0].f_under.threshold'] = { serial: 0, id: 'A95AD038' };
rct.cmd['grid_mon[0].f_over.threshold'] = { serial: 0, id: 'EBF7A4E8' };
rct.cmd['grid_mon[0].u_under.time'] = { serial: 0, id: 'EF89568B' };
rct.cmd['grid_mon[1].u_over.time'] = { serial: 0, id: 'F09CC4A2' };
rct.cmd['grid_mon[1].f_under.time'] = { serial: 0, id: 'F1FA5BB9' };
rct.cmd['grid_mon[1].f_over.time'] = { serial: 0, id: 'FD4F17C4' };
rct.cmd['g_sync.p_ac_load[0]'] = { serial: 0, id: '03A39CA2' };
rct.cmd['g_sync.u_zk_n_avg'] = { serial: 0, id: '0A04CA7F' };
rct.cmd['g_sync.p_ac[1]'] = { serial: 0, id: '147E8E26' };
rct.cmd['g_sync.p_ac_load_sum_lp'] = { serial: 0, id: '1AC87AA0' };
rct.cmd['g_sync.u_zk_sum_mov_avg'] = { serial: 0, id: '24150B85' };
rct.cmd['g_sync.u_l_rms[2]'] = { serial: 0, id: '2545E22D' };
rct.cmd['g_sync.p_ac_load[1]'] = { serial: 0, id: '2788928C' };
rct.cmd['g_sync.p_ac_sc[0]'] = { serial: 0, id: '27BE51D9' };
rct.cmd['g_sync.s_ac_lp[0]'] = { serial: 0, id: '3A444FC6' };
rct.cmd['g_sync.p_acc_lp'] = { serial: 0, id: '400F015B' };
rct.cmd['g_sync.s_ac_lp[1]'] = { serial: 0, id: '4077335D' };
rct.cmd['g_sync.p_ac[0]'] = { serial: 0, id: '43257820' };
rct.cmd['g_sync.u_ptp_rms[1]'] = { serial: 0, id: '485AD749' };
rct.cmd['g_sync.i_dr_lp[2]'] = { serial: 0, id: '48D73FA5' };
rct.cmd['g_sync.p_ac_sum'] = { serial: 0, id: '4E49AEC5' };
rct.cmd['g_sync.u_l_rms[1]'] = { serial: 0, id: '54B4684E' };
rct.cmd['g_sync.s_ac[2]'] = { serial: 0, id: '55C22966' };
rct.cmd['g_sync.p_ac_sc_sum'] = { serial: 0, id: '6002891F' };
rct.cmd['g_sync.s_ac[1]'] = { serial: 0, id: '612F7EAB' };
rct.cmd['g_sync.u_ptp_rms[0]'] = { serial: 0, id: '63476DBE' };
rct.cmd['g_sync.i_dr_eff[1]'] = { serial: 0, id: '650C1ED7' };
rct.cmd['g_sync.p_ac_lp[1]'] = { serial: 0, id: '6E1C5B78' };
rct.cmd['g_sync.p_ac_lp[0]'] = { serial: 0, id: '71E10B51' };
rct.cmd['g_sync.q_ac_sum_lp'] = { serial: 0, id: '7C78CBAC' };
rct.cmd['g_sync.q_ac[1]'] = { serial: 0, id: '82E3C121' };
rct.cmd['g_sync.s_ac_lp[2]'] = { serial: 0, id: '883DE9AB' };
rct.cmd['g_sync.i_dr_lp[0]'] = { serial: 0, id: '887D43C4' };
rct.cmd['g_sync.i_dr_eff[0]'] = { serial: 0, id: '89EE3EB5' };
rct.cmd['g_sync.u_zk_sum_avg'] = { serial: 0, id: '8A18539B' };
rct.cmd['g_sync.p_ac_grid_sum_lp'] = { serial: 0, id: '91617C58' };
rct.cmd['g_sync.i_dr_eff[2]'] = { serial: 0, id: '92BC682B' };
rct.cmd['g_sync.u_sg_avg[1]'] = { serial: 0, id: 'B0041187' };
rct.cmd['g_sync.p_ac_sc[2]'] = { serial: 0, id: 'B221BCFA' };
rct.cmd['g_sync.u_sg_avg[0]'] = { serial: 0, id: 'B55BA2CE' };
rct.cmd['g_sync.p_ac_lp[2]'] = { serial: 0, id: 'B9928C51' };
rct.cmd['g_sync.q_ac[2]'] = { serial: 0, id: 'BCA77559' };
rct.cmd['g_sync.p_ac[2]'] = { serial: 0, id: 'C03462F6' };
rct.cmd['g_sync.u_zk_p_avg'] = { serial: 0, id: 'C198B25B' };
rct.cmd['g_sync.s_ac[0]'] = { serial: 0, id: 'CABC44CA' };
rct.cmd['g_sync.u_l_rms[0]'] = { serial: 0, id: 'CF053085' };
rct.cmd['g_sync.p_ac_sum_lp'] = { serial: 0, id: 'DB2D69AE' };
rct.cmd['g_sync.s_ac_sum_lp'] = { serial: 0, id: 'DCA1CF26' };
rct.cmd['g_sync.i_dr_lp[1]'] = { serial: 0, id: 'DCAC0EA9' };
rct.cmd['g_sync.q_ac[0]'] = { serial: 0, id: 'E94C2EFC' };
rct.cmd['g_sync.p_ac_load[2]'] = { serial: 0, id: 'F0B436DD' };
rct.cmd['g_sync.u_ptp_rms[2]'] = { serial: 0, id: 'F25C339B' };
rct.cmd['g_sync.p_ac_sc[1]'] = { serial: 0, id: 'F5584F90' };
rct.cmd['hw_test.state'] = { serial: 0, id: '039BDE11' };
rct.cmd['hw_test.bt_power[6]'] = { serial: 0, id: '058F1759' };
rct.cmd['hw_test.bt_time[2]'] = { serial: 0, id: '0875C906' };
rct.cmd['hw_test.bt_time[9]'] = { serial: 0, id: '2082BFB6' };
rct.cmd['hw_test.bt_time[0]'] = { serial: 0, id: '3CA8E8D0' };
rct.cmd['hw_test.bt_power[7]'] = { serial: 0, id: '3D789979' };
rct.cmd['hw_test.bt_power[0]'] = { serial: 0, id: '4E2B42A4' };
rct.cmd['hw_test.bt_cycle'] = { serial: 0, id: '4E77B2CE' };
rct.cmd['hw_test.bt_time[3]'] = { serial: 0, id: '58378BD0' };
rct.cmd['hw_test.bt_power[2]'] = { serial: 0, id: '6BFF1AF4' };
rct.cmd['hw_test.bt_power[4]'] = { serial: 0, id: '71B70DCE' };
rct.cmd['hw_test.hw_switch_time'] = { serial: 0, id: '75AE19ED' };
rct.cmd['hw_test.bt_time[5]'] = { serial: 0, id: '77DD4364' };
rct.cmd['hw_test.bt_power[9]'] = { serial: 0, id: '86782D58' };
rct.cmd['hw_test.bt_time[8]'] = { serial: 0, id: '903FE89E' };
rct.cmd['hw_test.booster_test_index'] = { serial: 0, id: '9214A00C' };
rct.cmd['hw_test.bt_time[6]'] = { serial: 0, id: '940569AC' };
rct.cmd['hw_test.bt_power[5]'] = { serial: 0, id: 'B082C4D7' };
rct.cmd['hw_test.bt_power[1]'] = { serial: 0, id: 'C1C82889' };
rct.cmd['hw_test.bt_time[4]'] = { serial: 0, id: 'C3C7325E' };
rct.cmd['hw_test.bt_time[1]'] = { serial: 0, id: 'C66A522B' };
rct.cmd['hw_test.bt_power[3]'] = { serial: 0, id: 'C707102E' };
rct.cmd['hw_test.timer2'] = { serial: 0, id: 'CBEC8200' };
rct.cmd['hw_test.bt_time[7]'] = { serial: 0, id: 'D4C4A941' };
rct.cmd['hw_test.bt_power[8]'] = { serial: 0, id: 'E6248312' };
rct.cmd['io_board.rse_table[0]'] = { serial: 0, id: '0E799A56' };
rct.cmd['io_board.check_rs485_result'] = { serial: 0, id: '0FB40090' };
rct.cmd['io_board.check_rse_result'] = { serial: 0, id: '1B5445C4' };
rct.cmd['io_board.rse_table[10]'] = { serial: 0, id: '29CA60F8' };
rct.cmd['io_board.home_relay_sw_off_delay'] = { serial: 0, id: '2E0C6220' };
rct.cmd['io_board.rse_table[8]'] = { serial: 0, id: '3C705F61' };
rct.cmd['io_board.rse_table[6]'] = { serial: 0, id: '3DBCC6B4' };
rct.cmd['io_board.rse_table[12]'] = { serial: 0, id: '54DBC202' };
rct.cmd['io_board.rse_table[2]'] = { serial: 0, id: '5867B3BE' };
rct.cmd['io_board.check_state'] = { serial: 0, id: '58C1A946' };
rct.cmd['io_board.io1_s0_imp_per_kwh'] = { serial: 0, id: '5BD2DB45' };
rct.cmd['io_board.rse_table[14]'] = { serial: 0, id: '664A1326' };
rct.cmd['io_board.rse_table[9]'] = { serial: 0, id: '6830F6E4' };
rct.cmd['io_board.io2_s0_imp_per_kwh'] = { serial: 0, id: '68BA92E1' };
rct.cmd['io_board.rse_table[1]'] = { serial: 0, id: '6C2D00E4' };
rct.cmd['io_board.home_relay_sw_on_delay'] = { serial: 0, id: '7689BE6A' };
rct.cmd['io_board.rse_data_delay'] = { serial: 0, id: '8320B84C' };
rct.cmd['io_board.load_set'] = { serial: 0, id: '872F380B' };
rct.cmd['io_board.rse_table[15]'] = { serial: 0, id: '88C9707B' };
rct.cmd['io_board.rse_data'] = { serial: 0, id: '88F36D45' };
rct.cmd['io_board.rse_table[4]'] = { serial: 0, id: '98ACC1B8' };
rct.cmd['io_board.rse_table[7]'] = { serial: 0, id: '9B92023F' };
rct.cmd['io_board.check_start'] = { serial: 0, id: 'A3393749' };
rct.cmd['io_board.io1_s0_min_duration'] = { serial: 0, id: 'AACE057A' };
rct.cmd['io_board.rse_table[5]'] = { serial: 0, id: 'AC2E2A56' };
rct.cmd['io_board.rse_table[11]'] = { serial: 0, id: 'B851FA70' };
rct.cmd['io_board.p_rse_rise_grad'] = { serial: 0, id: 'BBE6B9DF' };
rct.cmd['io_board.home_relay_threshold'] = { serial: 0, id: 'BCC6F92F' };
rct.cmd['io_board.rse_table[3]'] = { serial: 0, id: 'BDFE5547' };
rct.cmd['io_board.s0_sum'] = { serial: 0, id: 'C7605E16' };
rct.cmd['io_board.io2_s0_min_duration'] = { serial: 0, id: 'CB1B3B10' };
rct.cmd['io_board.rse_table[13]'] = { serial: 0, id: 'D45913EC' };
rct.cmd['io_board.p_rse_desc_grad'] = { serial: 0, id: 'DAC7DD86' };
rct.cmd['io_board.home_relay_off_threshold'] = { serial: 0, id: 'E52B89FA' };
rct.cmd['io_board.s0_external_power'] = { serial: 0, id: 'E96F1844' };
rct.cmd['io_board.check_s0_result'] = { serial: 0, id: 'FA7DB323' };
rct.cmd['iso_struct.Rn'] = { serial: 0, id: '474F80D5' };
rct.cmd['iso_struct.r_min'] = { serial: 0, id: '777DC0EB' };
rct.cmd['iso_struct.Rp'] = { serial: 0, id: '8E41FC47' };
rct.cmd['iso_struct.Riso'] = { serial: 0, id: 'C717D1FB' };
rct.cmd['line_mon.u_max'] = { serial: 0, id: '6BBDC7C8' };
rct.cmd['line_mon.u_min'] = { serial: 0, id: '8D8E19F7' };
rct.cmd['line_mon.time_lim'] = { serial: 0, id: 'A1266D6B' };
rct.cmd['logger.log_rate'] = { serial: 0, id: '9A51A23B' };
rct.cmd['logger.buffer'] = { serial: 0, id: 'A305214D' };
rct.cmd['modbus.address'] = { serial: 0, id: '6C243F71' };
rct.cmd['net.id'] = { serial: 0, id: '08679611' };
rct.cmd['net.load_reduction'] = { serial: 0, id: '0C3815C2' };
rct.cmd['net.command'] = { serial: 0, id: '23F525DE' };
rct.cmd['net.net_tunnel_id'] = { serial: 0, id: '2E06172D' };
rct.cmd['net.index'] = { serial: 0, id: '3500F1E8' };
rct.cmd['net.prev_k'] = { serial: 0, id: '36214C57' };
rct.cmd['net.n_descendants'] = { serial: 0, id: '46635546' };
rct.cmd['net.slave_p_total'] = { serial: 0, id: '67C0A2F5' };
rct.cmd['net.master_timeout'] = { serial: 0, id: '6DCC4097' };
rct.cmd['net.n_slaves'] = { serial: 0, id: 'BFFF3CAD' };
rct.cmd['net.soc_av'] = { serial: 0, id: 'D3085D80' };
rct.cmd['net.slave_timeout'] = { serial: 0, id: 'D5205A45' };
rct.cmd['net.n_devices'] = { serial: 0, id: 'DB62DCB7' };
rct.cmd['nsm.f_low_entry'] = { serial: 0, id: '04EAAA98' };
rct.cmd['nsm.u_q_u[3]'] = { serial: 0, id: '0CBA34B9' };
rct.cmd['nsm.cos_phi_p[3][1]'] = { serial: 0, id: '10842019' };
rct.cmd['nsm.u_q_u[0]'] = { serial: 0, id: '1089ACA9' };
rct.cmd['nsm.rpm_lock_out_power'] = { serial: 0, id: '14FCA232' };
rct.cmd['nsm.cos_phi_p[1][0]'] = { serial: 0, id: '26260419' };
rct.cmd['nsm.cos_phi_p[0][1]'] = { serial: 0, id: '32CD0DB3' };
rct.cmd['nsm.p_u[0][1]'] = { serial: 0, id: '33F76B78' };
rct.cmd['nsm.p_u[3][1]'] = { serial: 0, id: '3515F4A0' };
rct.cmd['nsm.startup_grad'] = { serial: 0, id: '360BDE8A' };
rct.cmd['nsm.f_low_rise_grad_storage'] = { serial: 0, id: '38789061' };
rct.cmd['nsm.cos_phi_p[1][1]'] = { serial: 0, id: '4397D078' };
rct.cmd['nsm.pf_delay'] = { serial: 0, id: '43CD0B6F' };
rct.cmd['nsm.p_u[3][0]'] = { serial: 0, id: '4A61BAEE' };
rct.cmd['nsm.cos_phi_p[2][1]'] = { serial: 0, id: '4C2A7CDC' };
rct.cmd['nsm.startup_grad_after_fault'] = { serial: 0, id: '4C374958' };
rct.cmd['nsm.p_u[0][0]'] = { serial: 0, id: '53EF7649' };
rct.cmd['nsm.cos_phi_ts'] = { serial: 0, id: '71465EAF' };
rct.cmd['nsm.p_u[1][0]'] = { serial: 0, id: '7A5C91F8' };
rct.cmd['nsm.q_u_max_u_high_rel'] = { serial: 0, id: '7E75B17A' };
rct.cmd['nsm.cos_phi_p[0][0]'] = { serial: 0, id: '83A5333A' };
rct.cmd['nsm.q_u_max_u_high'] = { serial: 0, id: '88DEBCFE' };
rct.cmd['nsm.f_low_exit'] = { serial: 0, id: '8D33B6BC' };
rct.cmd['nsm.f_exit'] = { serial: 0, id: '93E6918D' };
rct.cmd['nsm.cos_phi_p[2][0]'] = { serial: 0, id: '9680077F' };
rct.cmd['nsm.p_u[2][0]'] = { serial: 0, id: 'A5044DCD' };
rct.cmd['nsm.cos_phi_const'] = { serial: 0, id: 'B76E2B4C' };
rct.cmd['nsm.min_cos_phi'] = { serial: 0, id: 'B98C8194' };
rct.cmd['nsm.u_q_u[1]'] = { serial: 0, id: 'BB617E51' };
rct.cmd['nsm.u_lock_out'] = { serial: 0, id: 'C46E9CA4' };
rct.cmd['nsm.Q_const'] = { serial: 0, id: 'CB9E1E6C' };
rct.cmd['nsm.q_u_max_u_low'] = { serial: 0, id: 'CCB51399' };
rct.cmd['nsm.u_lock_in'] = { serial: 0, id: 'D580567B' };
rct.cmd['nsm.pf_desc_grad'] = { serial: 0, id: 'D884AF95' };
rct.cmd['nsm.u_q_u[2]'] = { serial: 0, id: 'E271C6D2' };
rct.cmd['nsm.pf_rise_grad'] = { serial: 0, id: 'E49BE3ED' };
rct.cmd['nsm.pu_ts'] = { serial: 0, id: 'E6F1CB83' };
rct.cmd['nsm.q_u_max_u_low_rel'] = { serial: 0, id: 'E952FF2D' };
rct.cmd['nsm.p_u[1][1]'] = { serial: 0, id: 'EB7773BF' };
rct.cmd['nsm.p_limit'] = { serial: 0, id: 'F2405AC6' };
rct.cmd['nsm.cos_phi_p[3][0]'] = { serial: 0, id: 'F25591AA' };
rct.cmd['nsm.p_u[2][1]'] = { serial: 0, id: 'F49F58F2' };
rct.cmd['nsm.f_entry'] = { serial: 0, id: 'F6A85818' };
rct.cmd['nsm.f_low_rise_grad'] = { serial: 0, id: 'FAA837C8' };
rct.cmd['nsm.rpm_lock_in_power'] = { serial: 0, id: 'FCC39293' };
rct.cmd['common_control_bits'] = { serial: 0, id: '040385DB' };
rct.cmd['i_bottom_max'] = { serial: 0, id: '0D658831' };
rct.cmd['max_phase_shift'] = { serial: 0, id: '108FC93D' };
rct.cmd['partition[3].last_id'] = { serial: 0, id: '19608C98' };
rct.cmd['grid_pll[0].f'] = { serial: 0, id: '1C4A665F' };
rct.cmd['performance_free[0]'] = { serial: 0, id: '27EC8487' };
rct.cmd['grid_offset'] = { serial: 0, id: '2848A1EE' };
rct.cmd['power_spring_up'] = { serial: 0, id: '3A0EA5BE' };
rct.cmd['inv_struct.cosinus_phi'] = { serial: 0, id: '3C24F3E8' };
rct.cmd['power_spring_bat'] = { serial: 0, id: '3E728842' };
rct.cmd['power_spring_offset'] = { serial: 0, id: '494FE156' };
rct.cmd['update_is_allowed_id'] = { serial: 0, id: '4992E65A' };
rct.cmd['parameter_file'] = { serial: 0, id: '68BC034D' };
rct.cmd['i_dc_max'] = { serial: 0, id: '6C44F721' };
rct.cmd['inverter_sn'] = { serial: 0, id: '7924ABD9' };
rct.cmd['i_dc_slow_time'] = { serial: 0, id: '7946D888' };
rct.cmd['current_sensor_max'] = { serial: 0, id: '87E4387A' };
rct.cmd['svnversion_last_known'] = { serial: 0, id: '929394B7' };
rct.cmd['pas.period'] = { serial: 0, id: '9C8FE559' };
rct.cmd['phase_marker'] = { serial: 0, id: 'A12E9B43' };
rct.cmd['relays.bits_real'] = { serial: 0, id: 'A76AE9CA' };
rct.cmd['power_spring_down'] = { serial: 0, id: 'A9CF517D' };
rct.cmd['osci_struct.cmd_response_time'] = { serial: 0, id: 'B1D1BE71' };
rct.cmd['svnversion_factory'] = { serial: 0, id: 'BF9B6042' };
rct.cmd['i_ac_max_set'] = { serial: 0, id: 'C36675D4' };
rct.cmd['osci_struct.error'] = { serial: 0, id: 'DABD323E' };
rct.cmd['svnversion'] = { serial: 0, id: 'DDD1C2D0' };
rct.cmd['i_dc_slow_max'] = { serial: 0, id: 'E14B8679' };
rct.cmd['phase_shift_threshold'] = { serial: 0, id: 'E6AC95E5' };
//rct.cmd['android_description'] = { serial: 0, id: 'EBC62737' };
rct.cmd['p_buf_available'] = { serial: 0, id: 'F2BE0C9C' };
rct.cmd['power_mng.schedule[0]'] = { serial: 0, id: '011F41DB' };
rct.cmd['power_mng.battery_power'] = { serial: 0, id: '1156DFD0' };
rct.cmd['power_mng.schedule[2]'] = { serial: 0, id: '15AB1A61' };
rct.cmd['power_mng.soc_charge_power'] = { serial: 0, id: '1D2994EA' };
rct.cmd['power_mng.bat_empty_full'] = { serial: 0, id: '315D1490' };
rct.cmd['power_mng.schedule[6]'] = { serial: 0, id: '40B07CA4' };
rct.cmd['power_mng.schedule[8]'] = { serial: 0, id: '47A1DACA' };
rct.cmd['power_mng.schedule[4]'] = { serial: 0, id: '592B13DF' };
rct.cmd['power_mng.maximum_charge_voltage'] = { serial: 0, id: '59358EB2' };
rct.cmd['power_mng.is_heiphoss'] = { serial: 0, id: '5B10CE81' };
rct.cmd['power_mng.schedule[3]'] = { serial: 0, id: '6599E3D3' };
rct.cmd['power_mng.n_batteries'] = { serial: 0, id: '663F1452' };
rct.cmd['power_mng.bat_calib_days_in_advance'] = { serial: 0, id: '672552DC' };
rct.cmd['power_mng.schedule[9]'] = { serial: 0, id: '7AF0AD03' };
rct.cmd['power_mng.soc_min_island'] = { serial: 0, id: '8EBF9574' };
rct.cmd['power_mng.bat_calib_reqularity'] = { serial: 0, id: '93C0C2E2' };
rct.cmd['power_mng.stop_discharge_voltage_buffer'] = { serial: 0, id: '972B3029' };
rct.cmd['power_mng.soc_max'] = { serial: 0, id: '97997C93' };
rct.cmd['power_mng.u_acc_lp'] = { serial: 0, id: '97E3A6F2' };
rct.cmd['power_mng.schedule[5]'] = { serial: 0, id: '9A33F9B7' };
rct.cmd['power_mng.u_acc_mix_lp'] = { serial: 0, id: 'A7FA5C5D' };
rct.cmd['power_mng.model.bat_power_change'] = { serial: 0, id: 'A95EE214' };
rct.cmd['power_mng.minimum_discharge_voltage'] = { serial: 0, id: 'AEF76FA1' };
rct.cmd['power_mng.bat_next_calib_date'] = { serial: 0, id: 'B6623608' };
rct.cmd['power_mng.battery_power_extern'] = { serial: 0, id: 'BD008E29' };
rct.cmd['power_mng.soc_charge'] = { serial: 0, id: 'BD3A23C3' };
rct.cmd['power_mng.soc_min'] = { serial: 0, id: 'CE266F0F' };
rct.cmd['power_mng.stop_charge_current'] = { serial: 0, id: 'D197CBE0' };
rct.cmd['power_mng.soc_target_set'] = { serial: 0, id: 'D1DFC969' };
rct.cmd['power_mng.state'] = { serial: 0, id: 'DC667958' };
rct.cmd['power_mng.schedule[1]'] = { serial: 0, id: 'E24B00BD' };
rct.cmd['power_mng.amp_hours_measured'] = { serial: 0, id: 'E9BBF6E4' };
rct.cmd['power_mng.stop_discharge_current'] = { serial: 0, id: 'F1342795' };
rct.cmd['power_mng.calib_charge_power'] = { serial: 0, id: 'F393B7B0' };
rct.cmd['power_mng.schedule[7]'] = { serial: 0, id: 'F52C0B50' };
rct.cmd['power_mng.amp_hours'] = { serial: 0, id: 'FBD94C1F' };
rct.cmd['p_rec_req[1]'] = { serial: 0, id: '0AA372CE' };
rct.cmd['p_rec_req[0]'] = { serial: 0, id: '1ABA3EE8' };
rct.cmd['p_rec_req[2]'] = { serial: 0, id: '365D12DA' };
rct.cmd['p_rec_lim[1]'] = { serial: 0, id: '54829753' };
rct.cmd['p_rec_available[2]'] = { serial: 0, id: '5D0CDCF0' };
rct.cmd['p_rec_lim[0]'] = { serial: 0, id: '85886E2E' };
rct.cmd['p_rec_available[1]'] = { serial: 0, id: '8F0FF9F3' };
rct.cmd['p_rec_lim[2]'] = { serial: 0, id: '9A67600D' };
rct.cmd['p_rec_available[0]'] = { serial: 0, id: 'B45FE275' };
rct.cmd['prim_sm.island_next_repeat_timeout'] = { serial: 0, id: '20FD4419' };
rct.cmd['prim_sm.island_flag'] = { serial: 0, id: '3623D82A' };
rct.cmd['prim_sm.island_reset_retrials_counter_time'] = { serial: 0, id: '5151D84C' };
rct.cmd['prim_sm.island_max_trials'] = { serial: 0, id: '73E3ED49' };
rct.cmd['prim_sm.island_reset_retrials_operation_time'] = { serial: 0, id: '751E80CA' };
rct.cmd['prim_sm.state'] = { serial: 0, id: '5F33284E' };
rct.cmd['prim_sm.state_source'] = { serial: 0, id: 'C40D5688' };
rct.cmd['prim_sm.island_retrials'] = { serial: 0, id: 'C4D87E96' };
rct.cmd['prim_sm.Uzk_pump_grad[0]'] = { serial: 0, id: 'E31F8B17' };
rct.cmd['rb485.f_grid[2]'] = { serial: 0, id: '0104EB6A' };
rct.cmd['rb485.phase_marker'] = { serial: 0, id: '07367B64' };
rct.cmd['rb485.version_boot'] = { serial: 0, id: '173D81E4' };
rct.cmd['rb485.u_l_grid[2]'] = { serial: 0, id: '21EE7CBB' };
rct.cmd['rb485.version_main'] = { serial: 0, id: '27650FE2' };
rct.cmd['rb485.f_wr[0]'] = { serial: 0, id: '3B5F6B9D' };
rct.cmd['rb485.f_wr[1]'] = { serial: 0, id: '6FD36B32' };
rct.cmd['rb485.u_l_grid[1]'] = { serial: 0, id: '7A9091EA' };
rct.cmd['rb485.f_wr[2]'] = { serial: 0, id: '905F707B' };
rct.cmd['rb485.u_l_grid[0]'] = { serial: 0, id: '93F976AB' };
rct.cmd['rb485.f_grid[0]'] = { serial: 0, id: '9558AD8A' };
rct.cmd['rb485.f_grid[1]'] = { serial: 0, id: 'FAE429C5' };
rct.cmd['switch_on_cond.u_min'] = { serial: 0, id: '1FEB2F67' };
rct.cmd['switch_on_cond.f_min'] = { serial: 0, id: '234DD4DF' };
rct.cmd['switch_on_cond.test_time_fault'] = { serial: 0, id: '3390CC2F' };
rct.cmd['switch_on_cond.max_rnd_test_time_fault'] = { serial: 0, id: '362346D4' };
rct.cmd['switch_on_cond.f_max'] = { serial: 0, id: '4DB1B91E' };
rct.cmd['switch_on_cond.u_max'] = { serial: 0, id: '934E64E9' };
rct.cmd['switch_on_cond.test_time'] = { serial: 0, id: 'ECABB6CF' };
rct.cmd['temperature.sink_temp_power_reduction'] = { serial: 0, id: '90B53336' };
rct.cmd['temperature.bat_temp_power_reduction'] = { serial: 0, id: 'A7447FC4' };
rct.cmd['wifi.ip'] = { serial: 0, id: '06E03755' };
rct.cmd['wifi.password'] = { serial: 0, id: '14C0E627' };
rct.cmd['wifi.dns_address'] = { serial: 0, id: '1D0623D6' };
rct.cmd['wifi.connect_to_server'] = { serial: 0, id: '392D1BEE' };
rct.cmd['wifi.connect_to_service'] = { serial: 0, id: '53886C09' };
rct.cmd['wifi.authentication_method'] = { serial: 0, id: '57429627' };
rct.cmd['wifi.mask'] = { serial: 0, id: '5952E5E6' };
rct.cmd['wifi.mode'] = { serial: 0, id: '5A316247' };
rct.cmd['wifi.sockb_port'] = { serial: 0, id: '6D7C0BF4' };
rct.cmd['wifi.encryption_algorithm'] = { serial: 0, id: '76CAA9BF' };
rct.cmd['wifi.gateway'] = { serial: 0, id: '7B1F7FBE' };
rct.cmd['wifi.sockb_ip'] = { serial: 0, id: '7DDE352B' };
rct.cmd['wifi.result'] = { serial: 0, id: '8CA00014' };
rct.cmd['wifi.connect_service_max_duration'] = { serial: 0, id: '907CD1DF' };
rct.cmd['wifi.service_port'] = { serial: 0, id: 'A1D2B565' };
rct.cmd['wifi.state'] = { serial: 0, id: 'B4222BDE' };
rct.cmd['wifi.connect_service_timestamp'] = { serial: 0, id: 'B7FEA209' };
rct.cmd['wifi.server_port'] = { serial: 0, id: 'D83DC6AC' };
rct.cmd['wifi.connected_ap_ssid'] = { serial: 0, id: 'F8DECCE6' };
rct.cmd['wifi.service_ip'] = { serial: 0, id: 'F9FD0D61' };
rct.cmd['wifi.server_ip'] = { serial: 0, id: 'FF2A258B' };

rct.cmdReverse = {};
rct.cmdReverse['0AFDD6CF'] = {
    name: 'acc_conv.i_acc_lp_fast',
    type: 'FLOAT',
    unit: 'A',
    description: 'Battery current',
    ioBrokerType: 'number',
};
rct.cmdReverse['B0FA4D23'] = {
    name: 'acc_conv.i_charge_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. battery converter charge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['B408E40A'] = {
    name: 'acc_conv.i_acc_lp_slow',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C642B9D6'] = {
    name: 'acc_conv.i_discharge_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. battery converter discharge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['D9F9F35B'] = {
    name: 'acc_conv.state_slow',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['E3F4D1DF'] = {
    name: 'acc_conv.i_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. battery converter current',
    ioBrokerType: 'number',
};
rct.cmdReverse['07C61FAD'] = {
    name: 'adc.u_ref_1_5v[0]',
    type: 'UINT16',
    unit: 'V',
    description: 'Reference voltage 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['16B28CCA'] = {
    name: 'adc.u_ref_1_5v[1]',
    type: 'UINT16',
    unit: 'V',
    description: 'Reference voltage 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['508FCE78'] = {
    name: 'adc.u_ref_1_5v[3]',
    type: 'UINT16',
    unit: 'V',
    description: 'Reference voltage 4',
    ioBrokerType: 'number',
};
rct.cmdReverse['715C84A1'] = {
    name: 'adc.u_ref_1_5v[2]',
    type: 'UINT16',
    unit: 'V',
    description: 'Reference voltage 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['B84FDCF9'] = {
    name: 'adc.u_acc',
    type: 'FLOAT',
    unit: 'V',
    description: 'Battery voltage (inverter)',
    ioBrokerType: 'number',
};
rct.cmdReverse['3B0C6A53'] = {
    name: 'bat_mng_struct.profile_pdc_max',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['3E25C391'] = {
    name: 'bat_mng_struct.bat_calib_soc_thresh',
    type: 'FLOAT',
    unit: '',
    description: 'Part of max historical SOC for battery calibration in advance',
    ioBrokerType: 'number',
};
rct.cmdReverse['B2FB9A90'] = {
    name: 'bat_mng_struct.k_trust',
    type: 'FLOAT',
    unit: '',
    description: 'How fast the actual prediction can be trusted [0..10]',
    ioBrokerType: 'number',
};
rct.cmdReverse['DE68F62D'] = {
    name: 'bat_mng_struct.profile_pext',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['DF6EA121'] = {
    name: 'bat_mng_struct.profile_pdc',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['F0A03A20'] = {
    name: 'bat_mng_struct.k',
    type: 'FLOAT',
    unit: '',
    description: 'Forecast correction',
    ioBrokerType: 'number',
};
rct.cmdReverse['F644DCA7'] = {
    name: 'bat_mng_struct.k_reserve',
    type: 'FLOAT',
    unit: '',
    description: 'Main reservation coefficient [0..2]',
    ioBrokerType: 'number',
};
rct.cmdReverse['FB57BA65'] = {
    name: 'bat_mng_struct.count',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['FC5AA529'] = {
    name: 'bat_mng_struct.bat_calib_soc_threshold',
    type: 'FLOAT',
    unit: '',
    description: 'SOC threshold for battery calibration in advance',
    ioBrokerType: 'number',
};
rct.cmdReverse['03D9C51F'] = {
    name: 'battery.cells_stat[0].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['056162CA'] = {
    name: 'battery.cells_stat[4].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['056417DF'] = {
    name: 'battery.cells_stat[3].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['064A60FE'] = {
    name: 'battery.cells_stat[4].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['06A9FFA2'] = {
    name: 'battery.charged_amp_hours',
    type: 'FLOAT',
    unit: 'Ah',
    description: 'Total charge flow into battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['077692DE'] = {
    name: 'battery.cells_stat[4].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['086C75B0'] = {
    name: 'battery.stack_software_version[3]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['09923C1E'] = {
    name: 'battery.cells_stat[3].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['0CFA8BC4'] = {
    name: 'battery.stack_cycles[1]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['0DE3D20D'] = {
    name: 'battery.status2',
    type: 'INT32',
    unit: '',
    description: 'Battery extra status',
    ioBrokerType: 'number',
};
rct.cmdReverse['0EF60C7E'] = {
    name: 'battery.cells_stat[3].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['120EC3B4'] = {
    name: 'battery.cells_stat[4].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['162491E8'] = {
    name: 'battery.module_sn[5]',
    type: 'STRING',
    unit: '',
    description: 'Module 5 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['16A1F844'] = {
    name: 'battery.bms_sn',
    type: 'STRING',
    unit: '',
    description: 'BMS Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['18D1E9E0'] = {
    name: 'battery.cells_stat[5].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['18F98B6D'] = {
    name: 'battery.cells_stat[3].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['1B39A3A3'] = {
    name: 'battery.bms_power_version',
    type: 'UINT32',
    unit: '',
    description: 'Software version BMS Power',
    ioBrokerType: 'number',
};
rct.cmdReverse['1E5FCA70'] = {
    name: 'battery.maximum_charge_current',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. charge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['1F73B6A4'] = {
    name: 'battery.cells_stat[3].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['21961B58'] = {
    name: 'battery.current',
    type: 'FLOAT',
    unit: 'A',
    description: 'Battery current',
    ioBrokerType: 'number',
};
rct.cmdReverse['257B5945'] = {
    name: 'battery.cells_stat[2].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['257B7612'] = {
    name: 'battery.module_sn[3]',
    type: 'STRING',
    unit: '',
    description: 'Module 3 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['26363AAE'] = {
    name: 'battery.cells_stat[1].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['265EACF6'] = {
    name: 'battery.cells_stat[2].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['27C39CEA'] = {
    name: 'battery.stack_cycles[6]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2A30A97E'] = {
    name: 'battery.stack_cycles[5]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2AACCAA7'] = {
    name: 'battery.max_cell_voltage',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2BC1E72B'] = {
    name: 'battery.discharged_amp_hours',
    type: 'FLOAT',
    unit: 'Ah',
    description: 'Total charge flow from battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['331D0689'] = {
    name: 'battery.cells_stat[2].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['336415EA'] = {
    name: 'battery.cells_stat[0].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['34E33726'] = {
    name: 'battery.cells_stat[2].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3503B92D'] = {
    name: 'battery.cells_stat[3].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['381B8BF9'] = {
    name: 'battery.soh',
    type: 'FLOAT',
    unit: '%',
    description: 'SOH (State of Health)',
    ioBrokerType: 'number',
};
rct.cmdReverse['3A7D5F53'] = {
    name: 'battery.cells_stat[1].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3BA1B77B'] = {
    name: 'battery.cells_stat[3].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3F98F58A'] = {
    name: 'battery.cells_stat[5].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['41B11ECF'] = {
    name: 'battery.cells_stat[3].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['428CCF46'] = {
    name: 'battery.cells_stat[5].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['442A3409'] = {
    name: 'battery.cells_stat[4].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4443C661'] = {
    name: 'battery.cells_stat[0].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4B51A539'] = {
    name: 'battery.prog_sn',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['4CB7C0DC'] = {
    name: 'battery.min_cell_voltage',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4D985F33'] = {
    name: 'battery.cells_stat[5].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E04DD55'] = {
    name: 'battery.soc_update_since',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E699086'] = {
    name: 'battery.module_sn[4]',
    type: 'STRING',
    unit: '',
    description: 'Module 4 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['501A162D'] = {
    name: 'battery.cells_resist[5]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['50514732'] = {
    name: 'battery.cells_stat[6].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['518C7BBE'] = {
    name: 'battery.cells_stat[5].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['537C719F'] = {
    name: 'battery.cells_stat[0].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5570401B'] = {
    name: 'battery.stored_energy',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Total energy flow into battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['55DDF7BA'] = {
    name: 'battery.max_cell_temperature',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5847E59E'] = {
    name: 'battery.maximum_charge_voltage_constant_u',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. charge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['5939EC5D'] = {
    name: 'battery.module_sn[6]',
    type: 'STRING',
    unit: '',
    description: 'Module 6 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['5A120CE4'] = {
    name: 'battery.cells_stat[1].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5A9EEFF0'] = {
    name: 'battery.stack_cycles[4]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5AF50FD7'] = {
    name: 'battery.cells_stat[4].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5BA122A5'] = {
    name: 'battery.stack_cycles[2]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['60749E5E'] = {
    name: 'battery.cells_stat[6].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['61EAC702'] = {
    name: 'battery.cells_stat[0].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6213589B'] = {
    name: 'battery.cells_stat[6].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6388556C'] = {
    name: 'battery.stack_software_version[0]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 0',
    ioBrokerType: 'number',
};
rct.cmdReverse['6445D856'] = {
    name: 'battery.cells_stat[1].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['649B10DA'] = {
    name: 'battery.cells_resist[0]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['65EED11B'] = {
    name: 'battery.voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Battery voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['6974798A'] = {
    name: 'battery.stack_software_version[6]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 6',
    ioBrokerType: 'number',
};
rct.cmdReverse['6DB1FDDC'] = {
    name: 'battery.cells_stat[4].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6E24632E'] = {
    name: 'battery.cells_stat[5].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6E491B50'] = {
    name: 'battery.maximum_charge_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. charge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['70349444'] = {
    name: 'battery.cells_stat[1].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['70A2AF4F'] = {
    name: 'battery.bat_status',
    type: 'INT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['71196579'] = {
    name: 'battery.cells_stat[5].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['71765BD8'] = {
    name: 'battery.status',
    type: 'INT32',
    unit: '',
    description: 'Battery status',
    ioBrokerType: 'number',
};
rct.cmdReverse['71CB0B57'] = {
    name: 'battery.cells_resist[1]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['7268CE4D'] = {
    name: 'battery.inv_cmd',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['73489528'] = {
    name: 'battery.module_sn[2]',
    type: 'STRING',
    unit: '',
    description: 'Module 2 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['770A6E7C'] = {
    name: 'battery.cells_stat[0].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['7E590128'] = {
    name: 'battery.cells_stat[0].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['7F42BB82'] = {
    name: 'battery.cells_stat[6].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['7FF6252C'] = {
    name: 'battery.cells_stat[5].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['804A3266'] = {
    name: 'battery.cells_stat[6].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['8160539D'] = {
    name: 'battery.cells_stat[4].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['885BB57E'] = {
    name: 'battery.cells_stat[6].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['889DC27F'] = {
    name: 'battery.cells_stat[0].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['88BBF8CB'] = {
    name: 'battery.cells_stat[5].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['89B25F4B'] = {
    name: 'battery.stack_cycles[3]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['8B9FF008'] = {
    name: 'battery.soc_target',
    type: 'FLOAT',
    precision: 1,
    multiplier: 100,
    unit: '%',
    description: 'Target SOC',
    ioBrokerType: 'number',
};
rct.cmdReverse['8BB08839'] = {
    name: 'battery.cells_stat[6].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['8DFFDD33'] = {
    name: 'battery.cells_stat[3].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['8EC23427'] = {
    name: 'battery.cells_stat[4].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['8EF9C9B8'] = {
    name: 'battery.cells_stat[6].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['902AFAFB'] = {
    name: 'battery.temperature',
    type: 'FLOAT',
    unit: '°C',
    description: 'Battery temperature',
    ioBrokerType: 'number',
};
rct.cmdReverse['90832471'] = {
    name: 'battery.cells_stat[1].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['91C325D9'] = {
    name: 'battery.cells_stat[0].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['91FB68CD'] = {
    name: 'battery.cells_stat[6].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['959930BF'] = {
    name: 'battery.soc',
    type: 'FLOAT',
    precision: 1,
    multiplier: 100,
    unit: '%',
    description: 'SOC (State of charge)',
    ioBrokerType: 'number',
};
rct.cmdReverse['99396810'] = {
    name: 'battery.module_sn[1]',
    type: 'STRING',
    unit: '',
    description: 'Module 1 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['993C06F6'] = {
    name: 'battery.cells_resist[3]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['9D785E8C'] = {
    name: 'battery.bms_software_version',
    type: 'UINT32',
    unit: '',
    description: 'Software version BMS Master',
    ioBrokerType: 'number',
};
rct.cmdReverse['9E314430'] = {
    name: 'battery.cells_stat[2].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A10D9A4B'] = {
    name: 'battery.min_cell_temperature',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A3E48B21'] = {
    name: 'battery.cells_stat[2].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A40906BF'] = {
    name: 'battery.stack_software_version[4]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 4',
    ioBrokerType: 'number',
};
rct.cmdReverse['A54C4685'] = {
    name: 'battery.stack_software_version[1]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['A616B022'] = {
    name: 'battery.soc_target_low',
    type: 'FLOAT',
    precision: 1,
    multiplier: 100,
    unit: '%',
    description: 'SOC target low',
    ioBrokerType: 'number',
};
rct.cmdReverse['A6871A4D'] = {
    name: 'battery.cells_stat[4].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A6C4FD4A'] = {
    name: 'battery.stack_cycles[0]',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A7DBD28C'] = {
    name: 'battery.cells_stat[2].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A7FE5C0C'] = {
    name: 'battery.cells_stat[2].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A9033880'] = {
    name: 'battery.used_energy',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Total energy flow from battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['AACAC898'] = {
    name: 'battery.cells_stat[4].t_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['ACF7666B'] = {
    name: 'battery.efficiency',
    type: 'FLOAT',
    unit: '',
    description: 'Battery efficiency (used energy / stored energy)',
    ioBrokerType: 'number',
};
rct.cmdReverse['B0EBE75A'] = {
    name: 'battery.minimum_discharge_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min. discharge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['B4E053D4'] = {
    name: 'battery.cells_stat[1].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B57B59BD'] = {
    name: 'battery.ah_capacity',
    type: 'FLOAT',
    unit: 'Ah',
    description: 'Battery capacity',
    ioBrokerType: 'number',
};
rct.cmdReverse['B81FB399'] = {
    name: 'battery.cells_stat[2].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B84A38AB'] = {
    name: 'battery.soc_target_high',
    type: 'FLOAT',
    precision: 1,
    multiplier: 100,
    unit: '',
    description: 'SOC target high',
    ioBrokerType: 'number',
};
rct.cmdReverse['B9E09F78'] = {
    name: 'battery.cells_stat[5].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['BB302278'] = {
    name: 'battery.cells_stat[1].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['BDE3BF0A'] = {
    name: 'battery.cells_stat[6].t_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C0680302'] = {
    name: 'battery.cells_stat[2].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C0DF2978'] = {
    name: 'battery.cycles',
    type: 'INT32',
    unit: '',
    description: 'Battery charge / discharge cycles',
    ioBrokerType: 'number',
};
rct.cmdReverse['C42F5807'] = {
    name: 'battery.cells_stat[1].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C6DA81A0'] = {
    name: 'battery.cells_stat[6].u_max.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C88EB032'] = {
    name: 'battery.cells_stat[0].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C8BA1729'] = {
    name: 'battery.stack_software_version[2]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['D0C47326'] = {
    name: 'battery.cells_stat[1].t_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['D60E7A2F'] = {
    name: 'battery.cells_stat[1].u_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DD5930A2'] = {
    name: 'battery.cells_stat[0].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DE9CBCB0'] = {
    name: 'battery.cells_stat[5].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DEE1957F'] = {
    name: 'battery.cells_resist[4]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['DF0A735C'] = {
    name: 'battery.maximum_discharge_current',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. discharge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['DFF966E3'] = {
    name: 'battery.cells_stat[6].t_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['E7177DEE'] = {
    name: 'battery.cells_stat[2].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['E7B0E692'] = {
    name: 'battery.bat_impedance.impedance_fine',
    type: 'FLOAT',
    unit: '',
    description: 'Battery circuit impedance',
    ioBrokerType: 'number',
};
rct.cmdReverse['EA77252E'] = {
    name: 'battery.minimum_discharge_voltage_constant_u',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min. discharge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['EB4C2597'] = {
    name: 'battery.cells_resist[6]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['EEA3F59B'] = {
    name: 'battery.stack_software_version[5]',
    type: 'UINT32',
    unit: '',
    description: 'Software version stack 5',
    ioBrokerType: 'number',
};
rct.cmdReverse['EECDFEFC'] = {
    name: 'battery.cells_stat[2].u_min.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['EFD3EC8A'] = {
    name: 'battery.cells_stat[5].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F044EDA0'] = {
    name: 'battery.cells_stat[3].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F257D342'] = {
    name: 'battery.cells_stat[1].t_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F3FD8CE6'] = {
    name: 'battery.cells_resist[2]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['F54BC06D'] = {
    name: 'battery.cells_stat[4].u_max.value',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FA3276DC'] = {
    name: 'battery.cells_stat[3].t_min.time',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FBF6D834'] = {
    name: 'battery.module_sn[0]',
    type: 'STRING',
    unit: '',
    description: 'Module 0 Serial Number',
    ioBrokerType: 'string',
};
rct.cmdReverse['FDBD9EE9'] = {
    name: 'battery.cells_stat[3].u_max.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FE44BA26'] = {
    name: 'battery.cells_stat[0].u_min.index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4BC0F974'] = {
    name: 'buf_v_control.power_reduction_max_solar',
    type: 'FLOAT',
    unit: 'Wp',
    description: 'Solar plant peak power',
    ioBrokerType: 'number',
};
rct.cmdReverse['F473BC5E'] = {
    name: 'buf_v_control.power_reduction_max_solar_grid',
    type: 'FLOAT',
    unit: 'W',
    description: 'Max. allowed grid feed-in power',
    ioBrokerType: 'number',
};
rct.cmdReverse['FE1AA500'] = {
    name: 'buf_v_control.power_reduction',
    type: 'FLOAT',
    unit: '',
    description: 'External power reduction based on solar plant peak power [0..1]',
    ioBrokerType: 'number',
};
rct.cmdReverse['4539A6D4'] = {
    name: 'can_bus.bms_update_response[0]',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['69AA598A'] = {
    name: 'can_bus.requested_id',
    type: 'INT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['7A67E33B'] = {
    name: 'can_bus.bms_update_response[1]',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['96629BB9'] = {
    name: 'can_bus.bms_update_state',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['BD4147B0'] = {
    name: 'can_bus.set_cell_resist',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['D143A391'] = {
    name: 'can_bus.set_cell_v_t',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6D5318C8'] = {
    name: 'cs_map[1]',
    type: 'UINT8',
    unit: '',
    description: 'Associate current sensor 1 with phase L',
    ioBrokerType: 'number',
};
rct.cmdReverse['D451EF88'] = {
    name: 'cs_map[2]',
    type: 'UINT8',
    unit: '',
    description: 'Associate current sensor 2 with phase L',
    ioBrokerType: 'number',
};
rct.cmdReverse['E0E16E63'] = {
    name: 'cs_map[0]',
    type: 'UINT8',
    unit: '',
    description: 'Associate current sensor 0 with phase L',
    ioBrokerType: 'number',
};
rct.cmdReverse['019C0B60'] = {
    name: 'cs_neg[2]',
    type: 'FLOAT',
    unit: '',
    description: 'Multiply value of the current sensor 2 by',
    ioBrokerType: 'number',
};
rct.cmdReverse['4C12C4C7'] = {
    name: 'cs_neg[1]',
    type: 'FLOAT',
    unit: '',
    description: 'Multiply value of the current sensor 1 by',
    ioBrokerType: 'number',
};
rct.cmdReverse['82258C01'] = {
    name: 'cs_neg[0]',
    type: 'FLOAT',
    unit: '',
    description: 'Multiply value of the current sensor 0 by',
    ioBrokerType: 'number',
};
rct.cmdReverse['16AF2A92'] = {
    name: 'db.power_board.Current_Mean',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['17E3AF97'] = {
    name: 'db.power_board.adc_p9V_meas',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['1F9CBBF2'] = {
    name: 'db.power_board.Calibr_Value_Mean',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2ED89924'] = {
    name: 'db.power_board.afi_t300',
    type: 'FLOAT',
    unit: 's',
    description: 'AFI 300 mA switching off time',
    ioBrokerType: 'number',
};
rct.cmdReverse['383A3614'] = {
    name: 'db.power_board.afi_i60',
    type: 'FLOAT',
    unit: 'A',
    description: 'AFI 60 mA threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['3EFEB931'] = {
    name: 'db.power_board.relays_state',
    type: 'UINT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['43FF47C3'] = {
    name: 'db.power_board.afi_t60',
    type: 'FLOAT',
    unit: 's',
    description: 'AFI 60 mA switching off time',
    ioBrokerType: 'number',
};
rct.cmdReverse['4F735D10'] = {
    name: 'db.temp2',
    type: 'FLOAT',
    unit: '°C',
    description: 'Heat sink (battery actuator) temperature',
    ioBrokerType: 'number',
};
rct.cmdReverse['5CD75669'] = {
    name: 'db.power_board.afi_t150',
    type: 'FLOAT',
    unit: 's',
    description: 'AFI 150 mA switching off time',
    ioBrokerType: 'number',
};
rct.cmdReverse['6279F2A3'] = {
    name: 'db.power_board.version_boot',
    type: 'UINT32',
    unit: '',
    description: 'PIC bootloader software version',
    ioBrokerType: 'number',
};
rct.cmdReverse['6BA10831'] = {
    name: 'db.power_board.afi_i30',
    type: 'FLOAT',
    unit: 'A',
    description: 'AFI 30 mA threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['6FB2E2BF'] = {
    name: 'db.power_board.afi_i150',
    type: 'FLOAT',
    unit: 'A',
    description: 'AFI 150 mA threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['742966A6'] = {
    name: 'db.power_board.afi_i300',
    type: 'FLOAT',
    unit: 'A',
    description: 'AFI 300 mA threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['7DA7D8B6'] = {
    name: 'db.power_board.version_main',
    type: 'UINT32',
    unit: '',
    description: 'PIC software version',
    ioBrokerType: 'number',
};
rct.cmdReverse['80835476'] = {
    name: 'db.power_board.adc_p5V_W_meas',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['9981F1AC'] = {
    name: 'db.power_board.adc_m9V_meas',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B0307591'] = {
    name: 'db.power_board.status',
    type: 'UINT16',
    unit: '',
    description: 'Power board status',
    ioBrokerType: 'number',
};
rct.cmdReverse['B69171C4'] = {
    name: 'db.power_board.Current_AC_RMS',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C0B7C4D2'] = {
    name: 'db.power_board.afi_t30',
    type: 'FLOAT',
    unit: 's',
    description: 'AFI 30 mA switching off time',
    ioBrokerType: 'number',
};
rct.cmdReverse['C24E85D0'] = {
    name: 'db.core_temp',
    type: 'FLOAT',
    unit: '°C',
    description: 'Core temperature',
    ioBrokerType: 'number',
};
rct.cmdReverse['DFB53AF3'] = {
    name: 'db.power_board.Current_Mean_Mean_AC',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F0527539'] = {
    name: 'db.power_board.adc_p3V3_meas',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F79D41D9'] = {
    name: 'db.temp1',
    type: 'FLOAT',
    unit: '°C',
    description: 'Heat sink temperature',
    ioBrokerType: 'number',
};
rct.cmdReverse['0CB5D21B'] = {
    name: 'dc_conv.dc_conv_struct[1].p_dc_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'Solar generator B power',
    ioBrokerType: 'number',
};
rct.cmdReverse['226A23A4'] = {
    name: 'dc_conv.dc_conv_struct[0].u_target',
    type: 'FLOAT',
    unit: 'V',
    description: 'MPP on input A',
    ioBrokerType: 'number',
};
rct.cmdReverse['4AE96C12'] = {
    name: 'dc_conv.dc_conv_struct[1].mpp.mpp_step',
    type: 'FLOAT',
    unit: 'V',
    description: 'MPP search step on input B',
    ioBrokerType: 'number',
};
rct.cmdReverse['5BB8075A'] = {
    name: 'dc_conv.dc_conv_struct[1].u_sg_lp',
    type: 'FLOAT',
    unit: 'V',
    description: 'Solar generator B voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['5E942C62'] = {
    name: 'dc_conv.dc_conv_struct[1].mpp.fixed_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Fixed voltage Solar generator B',
    ioBrokerType: 'number',
};
rct.cmdReverse['62B8940B'] = {
    name: 'dc_conv.start_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Inverter DC-voltage start value',
    ioBrokerType: 'number',
};
rct.cmdReverse['675776B1'] = {
    name: 'dc_conv.dc_conv_struct[1].u_target',
    type: 'FLOAT',
    unit: 'V',
    description: 'MPP on input B',
    ioBrokerType: 'number',
};
rct.cmdReverse['9E1A88F5'] = {
    name: 'dc_conv.dc_conv_struct[0].mpp.fixed_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Fixed voltage Solar generator A',
    ioBrokerType: 'number',
};
rct.cmdReverse['AA9AA253'] = {
    name: 'dc_conv.dc_conv_struct[1].p_dc',
    type: 'FLOAT',
    unit: 'W',
    description: 'Solar generator B power',
    ioBrokerType: 'number',
};
rct.cmdReverse['B298395D'] = {
    name: 'dc_conv.dc_conv_struct[0].u_sg_lp',
    type: 'FLOAT',
    unit: 'V',
    description: 'Solar generator A voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['B5317B78'] = {
    name: 'dc_conv.dc_conv_struct[0].p_dc',
    type: 'FLOAT',
    unit: 'W',
    description: 'Solar generator A power',
    ioBrokerType: 'number',
};
rct.cmdReverse['B836B50C'] = {
    name: 'dc_conv.dc_conv_struct[1].rescan_correction',
    type: 'FLOAT',
    unit: 'V',
    description: 'Last global rescan MPP correction on input B',
    ioBrokerType: 'number',
};
rct.cmdReverse['BA8B8515'] = {
    name: 'dc_conv.dc_conv_struct[0].mpp.mpp_step',
    type: 'FLOAT',
    unit: 'V',
    description: 'MPP search step on input A',
    ioBrokerType: 'number',
};
rct.cmdReverse['DB11855B'] = {
    name: 'dc_conv.dc_conv_struct[0].p_dc_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'Solar generator A power',
    ioBrokerType: 'number',
};
rct.cmdReverse['DB45ABD0'] = {
    name: 'dc_conv.dc_conv_struct[0].rescan_correction',
    type: 'FLOAT',
    unit: 'V',
    description: 'Last global rescan MPP correction on input A',
    ioBrokerType: 'number',
};
rct.cmdReverse['F87A2A1E'] = {
    name: 'dc_conv.last_rescan',
    type: 'UINT32',
    unit: '',
    description: 'Last global rescan',
    ioBrokerType: 'number',
};
rct.cmdReverse['29BDA75F'] = {
    name: 'display_struct.brightness',
    type: 'UINT8',
    unit: '',
    description: 'Display brightness, [0..255]',
    ioBrokerType: 'number',
};
rct.cmdReverse['C1D051EC'] = {
    name: 'display_struct.variate_contrast',
    type: 'UINT8',
    unit: '',
    description: 'Display pixel test mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['F247BB16'] = {
    name: 'display_struct.contrast',
    type: 'UINT8',
    unit: '',
    description: 'Display contrast',
    ioBrokerType: 'number',
};
rct.cmdReverse['031A6110'] = {
    name: 'energy.e_ext_month',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'External month energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['0C588B75'] = {
    name: 'energy.e_ext_day_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['0F28E2E1'] = {
    name: 'energy.e_ext_total_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['10970E9D'] = {
    name: 'energy.e_ac_month',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Month energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['126ABC86'] = {
    name: 'energy.e_grid_load_month',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Month energy grid load',
    ioBrokerType: 'number',
};
rct.cmdReverse['1BFA5A33'] = {
    name: 'energy.e_grid_load_total_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['21E1A802'] = {
    name: 'energy.e_dc_month_sum[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['241F1F98'] = {
    name: 'energy.e_dc_day_sum[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['26EFFC2F'] = {
    name: 'energy.e_grid_feed_year',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Year energy grid feed-in',
    ioBrokerType: 'number',
};
rct.cmdReverse['27C828F4'] = {
    name: 'energy.e_grid_feed_total_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2AE703F2'] = {
    name: 'energy.e_dc_day[0]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator A day energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['2F3C1D7D'] = {
    name: 'energy.e_load_day',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Household day energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['3A873343'] = {
    name: 'energy.e_ac_day_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3A9D2680'] = {
    name: 'energy.e_ext_year_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3C87C4F5'] = {
    name: 'energy.e_grid_feed_day',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Day energy grid feed-in',
    ioBrokerType: 'number',
};
rct.cmdReverse['44D4C533'] = {
    name: 'energy.e_grid_feed_total',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Total energy grid feed-in',
    ioBrokerType: 'number',
};
rct.cmdReverse['495BF0B6'] = {
    name: 'energy.e_dc_year_sum[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4BE02BB7'] = {
    name: 'energy.e_load_day_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4EE8DB78'] = {
    name: 'energy.e_load_year_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['62FBE7DC'] = {
    name: 'energy.e_grid_load_total',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Total energy grid load',
    ioBrokerType: 'number',
};
rct.cmdReverse['65B624AB'] = {
    name: 'energy.e_grid_feed_month',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Month energy grid feed-in',
    ioBrokerType: 'number',
};
rct.cmdReverse['6709A2F4'] = {
    name: 'energy.e_ac_year_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['68EEFD3D'] = {
    name: 'energy.e_dc_total[1]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator B total energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['6CFCD774'] = {
    name: 'energy.e_dc_year_sum[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6FF4BD55'] = {
    name: 'energy.e_ext_month_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['79C0A724'] = {
    name: 'energy.e_ac_total_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['7AB9B045'] = {
    name: 'energy.e_dc_month[1]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator B month energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['7E096024'] = {
    name: 'energy.e_load_total_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['812E5ADD'] = {
    name: 'energy.e_dc_total_sum[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['81AE960B'] = {
    name: 'energy.e_dc_month[0]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator A month energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['84ABE3D8'] = {
    name: 'energy.e_grid_feed_year_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['867DEF7D'] = {
    name: 'energy.e_grid_load_day',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Day energy grid load',
    ioBrokerType: 'number',
};
rct.cmdReverse['917E3622'] = {
    name: 'energy.e_ext_year',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'External year energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['A12BE39C'] = {
    name: 'energy.e_load_month_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A5341F4A'] = {
    name: 'energy.e_grid_feed_month_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A59C8428'] = {
    name: 'energy.e_ext_total',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'External total energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['AF64D0FE'] = {
    name: 'energy.e_dc_year[0]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator A year energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['B1EF67CE'] = {
    name: 'energy.e_ac_total',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Total energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['B7B2967F'] = {
    name: 'energy.e_dc_total_sum[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B9A026F9'] = {
    name: 'energy.e_ext_day',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'External day energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['BD55905F'] = {
    name: 'energy.e_ac_day',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Day energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['BD55D796'] = {
    name: 'energy.e_dc_year[1]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator B year energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['C0CC81B6'] = {
    name: 'energy.e_ac_year',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Year energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['C7D3B479'] = {
    name: 'energy.e_load_year',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Household year energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['C9D76279'] = {
    name: 'energy.e_dc_day_sum[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['D9D66B76'] = {
    name: 'energy.e_grid_load_year_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DA207111'] = {
    name: 'energy.e_grid_load_month_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DE17F021'] = {
    name: 'energy.e_grid_load_year',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Year energy grid load',
    ioBrokerType: 'number',
};
rct.cmdReverse['EAEEB3CA'] = {
    name: 'energy.e_dc_month_sum[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['EFF4B537'] = {
    name: 'energy.e_load_total',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Household total energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['F0BE6429'] = {
    name: 'energy.e_load_month',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Household month energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['FBF3CE97'] = {
    name: 'energy.e_dc_day[1]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator B day energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['FBF8D63C'] = {
    name: 'energy.e_grid_load_day_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FC1C614E'] = {
    name: 'energy.e_ac_month_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FC724A9E'] = {
    name: 'energy.e_dc_total[0]',
    type: 'FLOAT',
    unit: 'Wh',
    description: 'Solar generator A total energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['FDB81124'] = {
    name: 'energy.e_grid_feed_day_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['234B4736'] = {
    name: 'fault[1].flt',
    type: 'UINT32',
    unit: '',
    description: 'Error bit field 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['37F9D5CA'] = {
    name: 'fault[0].flt',
    type: 'UINT32',
    unit: '',
    description: 'Error bit field 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['3B7FCD47'] = {
    name: 'fault[2].flt',
    type: 'UINT32',
    unit: '',
    description: 'Error bit field 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['7F813D73'] = {
    name: 'fault[3].flt',
    type: 'UINT32',
    unit: '',
    description: 'Error bit field 4',
    ioBrokerType: 'number',
};
rct.cmdReverse['43F16F7E'] = {
    name: 'flash_state',
    type: 'UINT16',
    unit: '',
    description: 'Flash state',
    ioBrokerType: 'number',
};
rct.cmdReverse['46892579'] = {
    name: 'flash_param.write_cycles',
    type: 'UINT32',
    unit: '',
    description: 'Write cycles of flash parameters',
    ioBrokerType: 'number',
};
rct.cmdReverse['65A44A98'] = { name: 'flash_mem', type: 'STRING', unit: '', description: '', ioBrokerType: 'string' };
rct.cmdReverse['96E32D11'] = {
    name: 'flash_param.erase_cycles',
    type: 'UINT32',
    unit: '',
    description: 'Erase cycles of flash parameter',
    ioBrokerType: 'number',
};
rct.cmdReverse['B238942F'] = {
    name: 'last_successfull_flash_op',
    type: 'INT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['E63A3529'] = {
    name: 'flash_result',
    type: 'UINT16',
    unit: '',
    description: 'Flash result',
    ioBrokerType: 'number',
};
rct.cmdReverse['0E0505B4'] = {
    name: 'flash_rtc.time_stamp_set',
    type: 'UINT32',
    unit: '',
    description: 'Set date/time',
    ioBrokerType: 'number',
};
rct.cmdReverse['2266DCB8'] = {
    name: 'flash_rtc.rtc_mcc_quartz_max_diff',
    type: 'FLOAT',
    unit: 'ppm',
    description: 'Maximum allowed quartz frequency difference between RTC and Microcontroller',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E0C56F2'] = {
    name: 'flash_rtc.rtc_mcc_quartz_ppm_difference',
    type: 'FLOAT',
    unit: 'ppm',
    description: 'Quartz frequency difference between RTC and Microcontroller',
    ioBrokerType: 'number',
};
rct.cmdReverse['7301A5A7'] = {
    name: 'flash_rtc.time_stamp_factory',
    type: 'UINT32',
    unit: '',
    description: 'Production date',
    ioBrokerType: 'number',
};
rct.cmdReverse['D166D94D'] = {
    name: 'flash_rtc.time_stamp',
    type: 'UINT32',
    unit: '',
    description: 'Actual date/time',
    ioBrokerType: 'number',
};
rct.cmdReverse['DD90A328'] = {
    name: 'flash_rtc.time_stamp_update',
    type: 'UINT32',
    unit: '',
    description: 'Last update date',
    ioBrokerType: 'number',
};
rct.cmdReverse['3A3050E6'] = {
    name: 'grid_lt.threshold',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['9061EA7B'] = {
    name: 'grid_lt.granularity',
    type: 'FLOAT',
    unit: '',
    description: 'Resolution',
    ioBrokerType: 'number',
};
rct.cmdReverse['D9E721A5'] = {
    name: 'grid_lt.timeframe',
    type: 'FLOAT',
    unit: '',
    description: 'Timeframe',
    ioBrokerType: 'number',
};
rct.cmdReverse['016109E1'] = {
    name: 'grid_mon[0].u_over.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Max. voltage switch-off time level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['3044195F'] = {
    name: 'grid_mon[1].u_under.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Min. voltage switch-off time level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['3CB1EF01'] = {
    name: 'grid_mon[0].u_under.threshold',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min. voltage level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['3E722B43'] = {
    name: 'grid_mon[1].f_under.threshold',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Min. frequency level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['5438B68E'] = {
    name: 'grid_mon[1].u_over.threshold',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. voltage level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['70E28322'] = {
    name: 'grid_mon[0].f_under.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Min. frequency switch-off time level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['82CD1525'] = {
    name: 'grid_mon[1].u_under.threshold',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min. voltage level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['915CD4A4'] = {
    name: 'grid_mon[1].f_over.threshold',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Max. frequency level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['933F9A24'] = {
    name: 'grid_mon[0].f_over.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Max. frequency switch-off time level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['A6271C2E'] = {
    name: 'grid_mon[0].u_over.threshold',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. voltage level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['A95AD038'] = {
    name: 'grid_mon[0].f_under.threshold',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Min. frequency level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['EBF7A4E8'] = {
    name: 'grid_mon[0].f_over.threshold',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Max. frequency level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['EF89568B'] = {
    name: 'grid_mon[0].u_under.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Min. voltage switch-off time level 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['F09CC4A2'] = {
    name: 'grid_mon[1].u_over.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Max. voltage switch-off time level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['F1FA5BB9'] = {
    name: 'grid_mon[1].f_under.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Min. frequency switch-off time level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['FD4F17C4'] = {
    name: 'grid_mon[1].f_over.time',
    type: 'FLOAT',
    unit: 's',
    description: 'Max. frequency switch-off time level 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['03A39CA2'] = {
    name: 'g_sync.p_ac_load[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Load household phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['0A04CA7F'] = {
    name: 'g_sync.u_zk_n_avg',
    type: 'FLOAT',
    unit: 'V',
    description: 'Negative buffer capacitor voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['147E8E26'] = {
    name: 'g_sync.p_ac[1]',
    type: 'FLOAT',
    unit: '',
    description: 'AC2',
    ioBrokerType: 'number',
};
rct.cmdReverse['1AC87AA0'] = {
    name: 'g_sync.p_ac_load_sum_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'Load household - external Power',
    ioBrokerType: 'number',
};
rct.cmdReverse['24150B85'] = {
    name: 'g_sync.u_zk_sum_mov_avg',
    type: 'FLOAT',
    unit: 'V',
    description: 'Actual DC link voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['2545E22D'] = {
    name: 'g_sync.u_l_rms[2]',
    type: 'FLOAT',
    unit: 'V',
    description: 'AC voltage phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['2788928C'] = {
    name: 'g_sync.p_ac_load[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Load household phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['27BE51D9'] = {
    name: 'g_sync.p_ac_sc[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Grid power phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['3A444FC6'] = {
    name: 'g_sync.s_ac_lp[0]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['400F015B'] = {
    name: 'g_sync.p_acc_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'Battery power',
    ioBrokerType: 'number',
};
rct.cmdReverse['4077335D'] = {
    name: 'g_sync.s_ac_lp[1]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['43257820'] = {
    name: 'g_sync.p_ac[0]',
    type: 'FLOAT',
    unit: '',
    description: 'AC1',
    ioBrokerType: 'number',
};
rct.cmdReverse['485AD749'] = {
    name: 'g_sync.u_ptp_rms[1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Phase to phase voltage 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['48D73FA5'] = {
    name: 'g_sync.i_dr_lp[2]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 3 (average)',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E49AEC5'] = {
    name: 'g_sync.p_ac_sum',
    type: 'FLOAT',
    unit: 'W',
    description: 'Real power',
    ioBrokerType: 'number',
};
rct.cmdReverse['54B4684E'] = {
    name: 'g_sync.u_l_rms[1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'AC voltage phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['55C22966'] = {
    name: 'g_sync.s_ac[2]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['6002891F'] = {
    name: 'g_sync.p_ac_sc_sum',
    type: 'FLOAT',
    unit: 'W',
    description: 'Grid power (ext. sensors)',
    ioBrokerType: 'number',
};
rct.cmdReverse['612F7EAB'] = {
    name: 'g_sync.s_ac[1]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['63476DBE'] = {
    name: 'g_sync.u_ptp_rms[0]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Phase to phase voltage 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['650C1ED7'] = {
    name: 'g_sync.i_dr_eff[1]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['6E1C5B78'] = {
    name: 'g_sync.p_ac_lp[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'AC power phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['71E10B51'] = {
    name: 'g_sync.p_ac_lp[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'AC power phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['7C78CBAC'] = {
    name: 'g_sync.q_ac_sum_lp',
    type: 'FLOAT',
    unit: 'var',
    description: 'Reactive power',
    ioBrokerType: 'number',
};
rct.cmdReverse['82E3C121'] = {
    name: 'g_sync.q_ac[1]',
    type: 'FLOAT',
    unit: 'var',
    description: 'Reactive power phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['883DE9AB'] = {
    name: 'g_sync.s_ac_lp[2]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['887D43C4'] = {
    name: 'g_sync.i_dr_lp[0]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 1 (average)',
    ioBrokerType: 'number',
};
rct.cmdReverse['89EE3EB5'] = {
    name: 'g_sync.i_dr_eff[0]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['8A18539B'] = {
    name: 'g_sync.u_zk_sum_avg',
    type: 'FLOAT',
    unit: 'V',
    description: 'DC link voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['91617C58'] = {
    name: 'g_sync.p_ac_grid_sum_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'Total grid power',
    ioBrokerType: 'number',
};
rct.cmdReverse['92BC682B'] = {
    name: 'g_sync.i_dr_eff[2]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['B0041187'] = {
    name: 'g_sync.u_sg_avg[1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Solar generator B voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['B221BCFA'] = {
    name: 'g_sync.p_ac_sc[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Grid power phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['B55BA2CE'] = {
    name: 'g_sync.u_sg_avg[0]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Solar generator A voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['B9928C51'] = {
    name: 'g_sync.p_ac_lp[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'AC power phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['BCA77559'] = {
    name: 'g_sync.q_ac[2]',
    type: 'FLOAT',
    unit: 'var',
    description: 'Reactive power phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['C03462F6'] = {
    name: 'g_sync.p_ac[2]',
    type: 'FLOAT',
    unit: '',
    description: 'AC3',
    ioBrokerType: 'number',
};
rct.cmdReverse['C198B25B'] = {
    name: 'g_sync.u_zk_p_avg',
    type: 'FLOAT',
    unit: 'V',
    description: 'Positive buffer capacitor voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['CABC44CA'] = {
    name: 'g_sync.s_ac[0]',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['CF053085'] = {
    name: 'g_sync.u_l_rms[0]',
    type: 'FLOAT',
    unit: 'V',
    description: 'AC voltage phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['DB2D69AE'] = {
    name: 'g_sync.p_ac_sum_lp',
    type: 'FLOAT',
    unit: 'W',
    description: 'AC power',
    ioBrokerType: 'number',
};
rct.cmdReverse['DCA1CF26'] = {
    name: 'g_sync.s_ac_sum_lp',
    type: 'FLOAT',
    unit: 'VA',
    description: 'Apparent power',
    ioBrokerType: 'number',
};
rct.cmdReverse['DCAC0EA9'] = {
    name: 'g_sync.i_dr_lp[1]',
    type: 'FLOAT',
    unit: 'A',
    description: 'Current phase 2 (average)',
    ioBrokerType: 'number',
};
rct.cmdReverse['E94C2EFC'] = {
    name: 'g_sync.q_ac[0]',
    type: 'FLOAT',
    unit: 'var',
    description: 'Reactive power phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['F0B436DD'] = {
    name: 'g_sync.p_ac_load[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Load household phase 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['F25C339B'] = {
    name: 'g_sync.u_ptp_rms[2]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Phase to phase voltage 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['F5584F90'] = {
    name: 'g_sync.p_ac_sc[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Grid power phase 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['039BDE11'] = {
    name: 'hw_test.state',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['058F1759'] = {
    name: 'hw_test.bt_power[6]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['0875C906'] = {
    name: 'hw_test.bt_time[2]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2082BFB6'] = {
    name: 'hw_test.bt_time[9]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3CA8E8D0'] = {
    name: 'hw_test.bt_time[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3D789979'] = {
    name: 'hw_test.bt_power[7]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E2B42A4'] = {
    name: 'hw_test.bt_power[0]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4E77B2CE'] = {
    name: 'hw_test.bt_cycle',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['58378BD0'] = {
    name: 'hw_test.bt_time[3]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6BFF1AF4'] = {
    name: 'hw_test.bt_power[2]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['71B70DCE'] = {
    name: 'hw_test.bt_power[4]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['75AE19ED'] = {
    name: 'hw_test.hw_switch_time',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['77DD4364'] = {
    name: 'hw_test.bt_time[5]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['86782D58'] = {
    name: 'hw_test.bt_power[9]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['903FE89E'] = {
    name: 'hw_test.bt_time[8]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['9214A00C'] = {
    name: 'hw_test.booster_test_index',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['940569AC'] = {
    name: 'hw_test.bt_time[6]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B082C4D7'] = {
    name: 'hw_test.bt_power[5]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C1C82889'] = {
    name: 'hw_test.bt_power[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C3C7325E'] = {
    name: 'hw_test.bt_time[4]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C66A522B'] = {
    name: 'hw_test.bt_time[1]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C707102E'] = {
    name: 'hw_test.bt_power[3]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['CBEC8200'] = {
    name: 'hw_test.timer2',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['D4C4A941'] = {
    name: 'hw_test.bt_time[7]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['E6248312'] = {
    name: 'hw_test.bt_power[8]',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['0E799A56'] = {
    name: 'io_board.rse_table[0]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0000',
    ioBrokerType: 'number',
};
rct.cmdReverse['0FB40090'] = {
    name: 'io_board.check_rs485_result',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['1B5445C4'] = {
    name: 'io_board.check_rse_result',
    type: 'UINT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['29CA60F8'] = {
    name: 'io_board.rse_table[10]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1010',
    ioBrokerType: 'number',
};
rct.cmdReverse['2E0C6220'] = {
    name: 'io_board.home_relay_sw_off_delay',
    type: 'FLOAT',
    unit: 's',
    description: 'Switching off delay',
    ioBrokerType: 'number',
};
rct.cmdReverse['3C705F61'] = {
    name: 'io_board.rse_table[8]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1000',
    ioBrokerType: 'number',
};
rct.cmdReverse['3DBCC6B4'] = {
    name: 'io_board.rse_table[6]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0110',
    ioBrokerType: 'number',
};
rct.cmdReverse['54DBC202'] = {
    name: 'io_board.rse_table[12]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1100',
    ioBrokerType: 'number',
};
rct.cmdReverse['5867B3BE'] = {
    name: 'io_board.rse_table[2]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0010',
    ioBrokerType: 'number',
};
rct.cmdReverse['58C1A946'] = {
    name: 'io_board.check_state',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5BD2DB45'] = {
    name: 'io_board.io1_s0_imp_per_kwh',
    type: 'INT16',
    unit: '',
    description: 'Number of impulses per kWh for S0 signal on I/O 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['664A1326'] = {
    name: 'io_board.rse_table[14]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1110',
    ioBrokerType: 'number',
};
rct.cmdReverse['6830F6E4'] = {
    name: 'io_board.rse_table[9]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1001',
    ioBrokerType: 'number',
};
rct.cmdReverse['68BA92E1'] = {
    name: 'io_board.io2_s0_imp_per_kwh',
    type: 'INT16',
    unit: '',
    description: 'Number of impulses per kWh for S0 signal on I/O 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['6C2D00E4'] = {
    name: 'io_board.rse_table[1]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0001',
    ioBrokerType: 'number',
};
rct.cmdReverse['7689BE6A'] = {
    name: 'io_board.home_relay_sw_on_delay',
    type: 'FLOAT',
    unit: 's',
    description: 'Switching on delay',
    ioBrokerType: 'number',
};
rct.cmdReverse['8320B84C'] = {
    name: 'io_board.rse_data_delay',
    type: 'FLOAT',
    unit: 's',
    description: 'Delay for new K4..K1 data',
    ioBrokerType: 'number',
};
rct.cmdReverse['872F380B'] = {
    name: 'io_board.load_set',
    type: 'FLOAT',
    unit: 'W',
    description: 'Dummy household load',
    ioBrokerType: 'number',
};
rct.cmdReverse['88C9707B'] = {
    name: 'io_board.rse_table[15]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1111',
    ioBrokerType: 'number',
};
rct.cmdReverse['88F36D45'] = {
    name: 'io_board.rse_data',
    type: 'UINT8',
    unit: '',
    description: 'Actual K4..K1 data',
    ioBrokerType: 'number',
};
rct.cmdReverse['98ACC1B8'] = {
    name: 'io_board.rse_table[4]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0100',
    ioBrokerType: 'number',
};
rct.cmdReverse['9B92023F'] = {
    name: 'io_board.rse_table[7]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0111',
    ioBrokerType: 'number',
};
rct.cmdReverse['A3393749'] = {
    name: 'io_board.check_start',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['AACE057A'] = {
    name: 'io_board.io1_s0_min_duration',
    type: 'FLOAT',
    unit: 's',
    description: 'Minimum S0 signal duration on I/O 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['AC2E2A56'] = {
    name: 'io_board.rse_table[5]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0101',
    ioBrokerType: 'number',
};
rct.cmdReverse['B851FA70'] = {
    name: 'io_board.rse_table[11]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1011',
    ioBrokerType: 'number',
};
rct.cmdReverse['BBE6B9DF'] = {
    name: 'io_board.p_rse_rise_grad',
    type: 'FLOAT',
    unit: 'P/Pn/s',
    description: 'Power rise gradient',
    ioBrokerType: 'number',
};
rct.cmdReverse['BCC6F92F'] = {
    name: 'io_board.home_relay_threshold',
    type: 'FLOAT',
    unit: 'W',
    description: 'Switching on threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['BDFE5547'] = {
    name: 'io_board.rse_table[3]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 0011',
    ioBrokerType: 'number',
};
rct.cmdReverse['C7605E16'] = {
    name: 'io_board.s0_sum',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['CB1B3B10'] = {
    name: 'io_board.io2_s0_min_duration',
    type: 'FLOAT',
    unit: 's',
    description: 'Minimum S0 signal duration on I/O 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['D45913EC'] = {
    name: 'io_board.rse_table[13]',
    type: 'FLOAT',
    unit: '',
    description: 'K4..K1: 1101',
    ioBrokerType: 'number',
};
rct.cmdReverse['DAC7DD86'] = {
    name: 'io_board.p_rse_desc_grad',
    type: 'FLOAT',
    unit: 'P/Pn/s',
    description: 'Power descent gradient',
    ioBrokerType: 'number',
};
rct.cmdReverse['E52B89FA'] = {
    name: 'io_board.home_relay_off_threshold',
    type: 'FLOAT',
    unit: 'W',
    description: 'Switching off threshold',
    ioBrokerType: 'number',
};
rct.cmdReverse['E96F1844'] = {
    name: 'io_board.s0_external_power',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['FA7DB323'] = {
    name: 'io_board.check_s0_result',
    type: 'UINT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['474F80D5'] = {
    name: 'iso_struct.Rn',
    type: 'FLOAT',
    unit: 'Ohm',
    description: 'Insulation resistance on negative DC input',
    ioBrokerType: 'number',
};
rct.cmdReverse['777DC0EB'] = {
    name: 'iso_struct.r_min',
    type: 'FLOAT',
    unit: 'Ohm',
    description: 'Minimum allowed insulation resistance',
    ioBrokerType: 'number',
};
rct.cmdReverse['8E41FC47'] = {
    name: 'iso_struct.Rp',
    type: 'FLOAT',
    unit: 'Ohm',
    description: 'Insulation resistance on positive DC input',
    ioBrokerType: 'number',
};
rct.cmdReverse['C717D1FB'] = {
    name: 'iso_struct.Riso',
    type: 'FLOAT',
    unit: 'Ohm',
    description: 'Total insulation resistance',
    ioBrokerType: 'number',
};
rct.cmdReverse['6BBDC7C8'] = {
    name: 'line_mon.u_max',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max line voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['8D8E19F7'] = {
    name: 'line_mon.u_min',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min line voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['A1266D6B'] = {
    name: 'line_mon.time_lim',
    type: 'FLOAT',
    unit: 's',
    description: 'Switch off time line voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['9A51A23B'] = {
    name: 'logger.log_rate',
    type: 'UINT16',
    unit: 's',
    description: 'Data log resolution',
    ioBrokerType: 'number',
};
rct.cmdReverse['A305214D'] = {
    name: 'logger.buffer',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['6C243F71'] = {
    name: 'modbus.address',
    type: 'UINT8',
    unit: '',
    description: 'RS485 address',
    ioBrokerType: 'number',
};
rct.cmdReverse['08679611'] = { name: 'net.id', type: 'UINT32', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['0C3815C2'] = {
    name: 'net.load_reduction',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['23F525DE'] = { name: 'net.command', type: 'UINT16', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['2E06172D'] = {
    name: 'net.net_tunnel_id',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3500F1E8'] = { name: 'net.index', type: 'INT8', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['36214C57'] = { name: 'net.prev_k', type: 'FLOAT', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['46635546'] = {
    name: 'net.n_descendants',
    type: 'INT8',
    unit: '',
    description: 'Number of descendant slaves',
    ioBrokerType: 'number',
};
rct.cmdReverse['67C0A2F5'] = {
    name: 'net.slave_p_total',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['6DCC4097'] = {
    name: 'net.master_timeout',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['BFFF3CAD'] = { name: 'net.n_slaves', type: 'UINT8', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['D3085D80'] = { name: 'net.soc_av', type: 'FLOAT', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['D5205A45'] = {
    name: 'net.slave_timeout',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['DB62DCB7'] = {
    name: 'net.n_devices',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['04EAAA98'] = {
    name: 'nsm.f_low_entry',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Entry frequency for P(f) under-frequency mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['0CBA34B9'] = {
    name: 'nsm.u_q_u[3]',
    type: 'FLOAT',
    unit: 'V',
    description: 'High voltage max. point',
    ioBrokerType: 'number',
};
rct.cmdReverse['10842019'] = {
    name: 'nsm.cos_phi_p[3][1]',
    type: 'FLOAT',
    unit: 'cos(rct_db)',
    description: 'Point 4 (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['1089ACA9'] = {
    name: 'nsm.u_q_u[0]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Low voltage min. point',
    ioBrokerType: 'number',
};
rct.cmdReverse['14FCA232'] = {
    name: 'nsm.rpm_lock_out_power',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Reactive Power Mode lock-out power',
    ioBrokerType: 'number',
};
rct.cmdReverse['26260419'] = {
    name: 'nsm.cos_phi_p[1][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 2',
    ioBrokerType: 'number',
};
rct.cmdReverse['32CD0DB3'] = {
    name: 'nsm.cos_phi_p[0][1]',
    type: 'FLOAT',
    unit: 'cos(Phi)',
    description: 'Point 1 (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['33F76B78'] = {
    name: 'nsm.p_u[0][1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Point 1 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['3515F4A0'] = {
    name: 'nsm.p_u[3][1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Point 4 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['360BDE8A'] = {
    name: 'nsm.startup_grad',
    type: 'FLOAT',
    unit: 'P/(Pn*s)',
    description: 'Startup gradient',
    ioBrokerType: 'number',
};
rct.cmdReverse['38789061'] = {
    name: 'nsm.f_low_rise_grad_storage',
    type: 'FLOAT',
    unit: '1/Pn*Hz',
    description: 'Power rise gradient for P(f) under-frequency mode with battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['4397D078'] = {
    name: 'nsm.cos_phi_p[1][1]',
    type: 'FLOAT',
    unit: 'cos(Phi)',
    description: 'Point 2 (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['43CD0B6F'] = {
    name: 'nsm.pf_delay',
    type: 'FLOAT',
    unit: 's',
    description: 'Delay time after P(f)',
    ioBrokerType: 'number',
};
rct.cmdReverse['4A61BAEE'] = {
    name: 'nsm.p_u[3][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 4 P/Pn',
    ioBrokerType: 'number',
};
rct.cmdReverse['4C2A7CDC'] = {
    name: 'nsm.cos_phi_p[2][1]',
    type: 'FLOAT',
    unit: 'cos(Phi)',
    description: 'Point 3 (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['4C374958'] = {
    name: 'nsm.startup_grad_after_fault',
    type: 'FLOAT',
    unit: 'P/(Pn*s)',
    description: 'Startup gradient after fault',
    ioBrokerType: 'number',
};
rct.cmdReverse['53EF7649'] = {
    name: 'nsm.p_u[0][0]',
    type: 'FLOAT',
    unit: '',
    description: 'Point 1 P/Pn',
    ioBrokerType: 'number',
};
rct.cmdReverse['71465EAF'] = {
    name: 'nsm.cos_phi_ts',
    type: 'FLOAT',
    unit: 's',
    description: 'Time const for filter',
    ioBrokerType: 'number',
};
rct.cmdReverse['7A5C91F8'] = {
    name: 'nsm.p_u[1][0]',
    type: 'FLOAT',
    unit: '',
    description: 'Point 2 P/Pn',
    ioBrokerType: 'number',
};
rct.cmdReverse['7E75B17A'] = {
    name: 'nsm.q_u_max_u_high_rel',
    type: 'FLOAT',
    unit: '',
    description: 'Qmax at upper voltage level relative to Smax (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['83A5333A'] = {
    name: 'nsm.cos_phi_p[0][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['88DEBCFE'] = {
    name: 'nsm.q_u_max_u_high',
    type: 'FLOAT',
    unit: 'var',
    description: 'Qmax at upper voltage level (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['8D33B6BC'] = {
    name: 'nsm.f_low_exit',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Exit frequency for P(f) under-frequency mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['93E6918D'] = {
    name: 'nsm.f_exit',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Exit frequency for P(f) over-frequency mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['9680077F'] = {
    name: 'nsm.cos_phi_p[2][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['A5044DCD'] = {
    name: 'nsm.p_u[2][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 3',
    ioBrokerType: 'number',
};
rct.cmdReverse['B76E2B4C'] = {
    name: 'nsm.cos_phi_const',
    type: 'FLOAT',
    unit: '',
    description: 'Cos phi constant value (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['B98C8194'] = {
    name: 'nsm.min_cos_phi',
    type: 'FLOAT',
    unit: '',
    description: 'Minimum allowed cos(phi) [0..1]',
    ioBrokerType: 'number',
};
rct.cmdReverse['BB617E51'] = {
    name: 'nsm.u_q_u[1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Low voltage max. point',
    ioBrokerType: 'number',
};
rct.cmdReverse['C46E9CA4'] = {
    name: 'nsm.u_lock_out',
    type: 'FLOAT',
    unit: 'V',
    description: 'Cos phi(P) lock out voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['CB9E1E6C'] = {
    name: 'nsm.Q_const',
    type: 'FLOAT',
    unit: 'var',
    description: 'Q constant value (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['CCB51399'] = {
    name: 'nsm.q_u_max_u_low',
    type: 'FLOAT',
    unit: 'var',
    description: 'Qmax at lower voltage level (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['D580567B'] = {
    name: 'nsm.u_lock_in',
    type: 'FLOAT',
    unit: 'V',
    description: 'Cos phi(P) lock in voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['D884AF95'] = {
    name: 'nsm.pf_desc_grad',
    type: 'FLOAT',
    unit: 'P/(Pn*s)',
    description: 'Power decrease gradient for P(f) mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['E271C6D2'] = {
    name: 'nsm.u_q_u[2]',
    type: 'FLOAT',
    unit: 'V',
    description: 'High voltage min. point',
    ioBrokerType: 'number',
};
rct.cmdReverse['E49BE3ED'] = {
    name: 'nsm.pf_rise_grad',
    type: 'FLOAT',
    unit: 'P/(Pn*s)',
    description: 'Power increase gradient after P(f) restriction',
    ioBrokerType: 'number',
};
rct.cmdReverse['E6F1CB83'] = {
    name: 'nsm.pu_ts',
    type: 'FLOAT',
    unit: 's',
    description: 'Time const for filter',
    ioBrokerType: 'number',
};
rct.cmdReverse['E952FF2D'] = {
    name: 'nsm.q_u_max_u_low_rel',
    type: 'FLOAT',
    unit: '',
    description: 'Qmax at lower voltage level relative to Smax (positive = overexcited)',
    ioBrokerType: 'number',
};
rct.cmdReverse['EB7773BF'] = {
    name: 'nsm.p_u[1][1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Point 2 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['F2405AC6'] = {
    name: 'nsm.p_limit',
    type: 'FLOAT',
    unit: 'W',
    description: 'Max. grid power',
    ioBrokerType: 'number',
};
rct.cmdReverse['F25591AA'] = {
    name: 'nsm.cos_phi_p[3][0]',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Point 4',
    ioBrokerType: 'number',
};
rct.cmdReverse['F49F58F2'] = {
    name: 'nsm.p_u[2][1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Point 3 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['F6A85818'] = {
    name: 'nsm.f_entry',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Entry frequency for P(f) over-frequency mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['FAA837C8'] = {
    name: 'nsm.f_low_rise_grad',
    type: 'FLOAT',
    unit: '1/Pn*Hz',
    description: 'Power rise gradient for P(f) under-frequency mode without battery',
    ioBrokerType: 'number',
};
rct.cmdReverse['FCC39293'] = {
    name: 'nsm.rpm_lock_in_power',
    type: 'FLOAT',
    unit: 'P/Pn',
    description: 'Reactive Power Mode lock-in power',
    ioBrokerType: 'number',
};
rct.cmdReverse['040385DB'] = {
    name: 'common_control_bits',
    type: 'UINT32',
    unit: '',
    description: 'Bit coded function',
    ioBrokerType: 'number',
};
rct.cmdReverse['0D658831'] = { name: 'i_bottom_max', type: 'FLOAT', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['108FC93D'] = {
    name: 'max_phase_shift',
    type: 'FLOAT',
    unit: 'degrees',
    description: 'Max. phase shift from 120 position',
    ioBrokerType: 'number',
};
rct.cmdReverse['19608C98'] = {
    name: 'partition[3].last_id',
    type: 'INT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['1C4A665F'] = {
    name: 'grid_pll[0].f',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Grid frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['27EC8487'] = {
    name: 'performance_free[0]',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['2848A1EE'] = { name: 'grid_offset', type: 'FLOAT', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['3A0EA5BE'] = {
    name: 'power_spring_up',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3C24F3E8'] = {
    name: 'inv_struct.cosinus_phi',
    type: 'FLOAT',
    unit: 'cos(Phi)',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['3E728842'] = {
    name: 'power_spring_bat',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['494FE156'] = {
    name: 'power_spring_offset',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['4992E65A'] = {
    name: 'update_is_allowed_id',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['68BC034D'] = {
    name: 'parameter_file',
    type: 'STRING',
    unit: '',
    description: 'Norm',
    ioBrokerType: 'string',
};
rct.cmdReverse['6C44F721'] = {
    name: 'i_dc_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. DC-component of Iac',
    ioBrokerType: 'number',
};
rct.cmdReverse['7924ABD9'] = {
    name: 'inverter_sn',
    type: 'STRING',
    unit: '',
    description: 'Serial number',
    ioBrokerType: 'string',
};
rct.cmdReverse['7946D888'] = {
    name: 'i_dc_slow_time',
    type: 'FLOAT',
    unit: 's',
    description: 'Time for slow DC-component of Iac',
    ioBrokerType: 'number',
};
rct.cmdReverse['87E4387A'] = {
    name: 'current_sensor_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Power Sensor current range',
    ioBrokerType: 'number',
};
rct.cmdReverse['929394B7'] = {
    name: 'svnversion_last_known',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['9C8FE559'] = { name: 'pas.period', type: 'UINT32', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['A12E9B43'] = {
    name: 'phase_marker',
    type: 'INT16',
    unit: '',
    description: 'Next phase after phase 1',
    ioBrokerType: 'number',
};
rct.cmdReverse['A76AE9CA'] = {
    name: 'relays.bits_real',
    type: 'UINT16',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['A9CF517D'] = {
    name: 'power_spring_down',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B1D1BE71'] = {
    name: 'osci_struct.cmd_response_time',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['BF9B6042'] = {
    name: 'svnversion_factory',
    type: 'STRING',
    unit: '',
    description: 'Control software factory version',
    ioBrokerType: 'string',
};
rct.cmdReverse['C36675D4'] = {
    name: 'i_ac_max_set',
    type: 'FLOAT',
    unit: 'A',
    description: 'Maximum AC throttle current',
    ioBrokerType: 'number',
};
rct.cmdReverse['DABD323E'] = {
    name: 'osci_struct.error',
    type: 'INT16',
    unit: '',
    description: 'Communication error',
    ioBrokerType: 'number',
};
rct.cmdReverse['DDD1C2D0'] = {
    name: 'svnversion',
    type: 'STRING',
    unit: '',
    description: 'Control software version',
    ioBrokerType: 'string',
};
rct.cmdReverse['E14B8679'] = {
    name: 'i_dc_slow_max',
    type: 'FLOAT',
    unit: 'A',
    description: 'Max. slow DC-component of Iac',
    ioBrokerType: 'number',
};
rct.cmdReverse['E6AC95E5'] = {
    name: 'phase_shift_threshold',
    type: 'UINT32',
    unit: '',
    description: 'Detection threshold',
    ioBrokerType: 'number',
};
//rct.cmdReverse['EBC62737'] = { name: 'android_description', type: 'STRING', unit: '', description: 'Device name',ioBrokerType: 'string' };
rct.cmdReverse['F2BE0C9C'] = {
    name: 'p_buf_available',
    type: 'FLOAT',
    unit: 'W',
    description: 'Available buffer power',
    ioBrokerType: 'number',
};
rct.cmdReverse['011F41DB'] = {
    name: 'power_mng.schedule[0]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['1156DFD0'] = {
    name: 'power_mng.battery_power',
    type: 'FLOAT',
    unit: 'W',
    description: 'Battery discharge power',
    ioBrokerType: 'number',
};
rct.cmdReverse['15AB1A61'] = {
    name: 'power_mng.schedule[2]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['1D2994EA'] = {
    name: 'power_mng.soc_charge_power',
    type: 'FLOAT',
    unit: 'W',
    description: 'Maintenance charge power',
    ioBrokerType: 'number',
};
rct.cmdReverse['315D1490'] = {
    name: 'power_mng.bat_empty_full',
    type: 'UINT8',
    unit: '',
    description: 'Bit 0 - battery was empty, bit 1 - battery was full',
    ioBrokerType: 'number',
};
rct.cmdReverse['40B07CA4'] = {
    name: 'power_mng.schedule[6]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['47A1DACA'] = {
    name: 'power_mng.schedule[8]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['592B13DF'] = {
    name: 'power_mng.schedule[4]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['59358EB2'] = {
    name: 'power_mng.maximum_charge_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Max. battery charge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['5B10CE81'] = {
    name: 'power_mng.is_heiphoss',
    type: 'UINT8',
    unit: '',
    description: 'HeiPhoss mode',
    ioBrokerType: 'number',
};
rct.cmdReverse['6599E3D3'] = {
    name: 'power_mng.schedule[3]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['663F1452'] = {
    name: 'power_mng.n_batteries',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['672552DC'] = {
    name: 'power_mng.bat_calib_days_in_advance',
    type: 'UINT8',
    unit: '',
    description: 'Battery calibration days in advance',
    ioBrokerType: 'number',
};
rct.cmdReverse['7AF0AD03'] = {
    name: 'power_mng.schedule[9]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['8EBF9574'] = {
    name: 'power_mng.soc_min_island',
    type: 'FLOAT',
    unit: '',
    description: 'Min SOC target (island)',
    ioBrokerType: 'number',
};
rct.cmdReverse['93C0C2E2'] = {
    name: 'power_mng.bat_calib_reqularity',
    type: 'UINT32',
    unit: 'days',
    description: 'Battery calibration interval',
    ioBrokerType: 'number',
};
rct.cmdReverse['972B3029'] = {
    name: 'power_mng.stop_discharge_voltage_buffer',
    type: 'FLOAT',
    unit: 'V',
    description: 'Stop discharge voltage buffer',
    ioBrokerType: 'number',
};
rct.cmdReverse['97997C93'] = {
    name: 'power_mng.soc_max',
    type: 'FLOAT',
    unit: '',
    description: 'Max SOC target',
    ioBrokerType: 'number',
};
rct.cmdReverse['97E3A6F2'] = {
    name: 'power_mng.u_acc_lp',
    type: 'FLOAT',
    unit: 'V',
    description: 'Battery voltage (inverter)',
    ioBrokerType: 'number',
};
rct.cmdReverse['9A33F9B7'] = {
    name: 'power_mng.schedule[5]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['A7FA5C5D'] = {
    name: 'power_mng.u_acc_mix_lp',
    type: 'FLOAT',
    unit: 'V',
    description: 'Battery voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['A95EE214'] = {
    name: 'power_mng.model.bat_power_change',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['AEF76FA1'] = {
    name: 'power_mng.minimum_discharge_voltage',
    type: 'FLOAT',
    unit: 'V',
    description: 'Min. battery discharge voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['B6623608'] = {
    name: 'power_mng.bat_next_calib_date',
    type: 'INT32',
    unit: '',
    description: 'Next battery calibration',
    ioBrokerType: 'number',
};
rct.cmdReverse['BD008E29'] = {
    name: 'power_mng.battery_power_extern',
    type: 'FLOAT',
    unit: 'W',
    description: 'Battery target power (positive = discharge)',
    ioBrokerType: 'number',
};
rct.cmdReverse['BD3A23C3'] = {
    name: 'power_mng.soc_charge',
    type: 'FLOAT',
    unit: '',
    description: 'SOC min maintenance charge',
    ioBrokerType: 'number',
};
rct.cmdReverse['CE266F0F'] = {
    name: 'power_mng.soc_min',
    type: 'FLOAT',
    precision: 1,
    multiplier: 100,
    unit: '',
    description: 'Min SOC target',
    ioBrokerType: 'number',
};
rct.cmdReverse['D197CBE0'] = {
    name: 'power_mng.stop_charge_current',
    type: 'FLOAT',
    unit: 'A',
    description: 'Stop charge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['D1DFC969'] = {
    name: 'power_mng.soc_target_set',
    type: 'FLOAT',
    unit: '',
    description: 'Force SOC target',
    ioBrokerType: 'number',
};
rct.cmdReverse['DC667958'] = {
    name: 'power_mng.state',
    type: 'UINT8',
    unit: '',
    description: 'Battery state machine',
    ioBrokerType: 'number',
};
rct.cmdReverse['E24B00BD'] = {
    name: 'power_mng.schedule[1]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['E9BBF6E4'] = {
    name: 'power_mng.amp_hours_measured',
    type: 'FLOAT',
    unit: 'Ah',
    description: 'Measured battery capacity',
    ioBrokerType: 'number',
};
rct.cmdReverse['F1342795'] = {
    name: 'power_mng.stop_discharge_current',
    type: 'FLOAT',
    unit: 'A',
    description: 'Stop discharge current',
    ioBrokerType: 'number',
};
rct.cmdReverse['F393B7B0'] = {
    name: 'power_mng.calib_charge_power',
    type: 'FLOAT',
    unit: 'W',
    description: 'Calibration charge power',
    ioBrokerType: 'number',
};
rct.cmdReverse['F52C0B50'] = {
    name: 'power_mng.schedule[7]',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['FBD94C1F'] = {
    name: 'power_mng.amp_hours',
    type: 'FLOAT',
    unit: 'Ah',
    description: 'Battery energy',
    ioBrokerType: 'number',
};
rct.cmdReverse['0AA372CE'] = {
    name: 'p_rec_req[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Required battery to grid power',
    ioBrokerType: 'number',
};
rct.cmdReverse['1ABA3EE8'] = {
    name: 'p_rec_req[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Required compensation power',
    ioBrokerType: 'number',
};
rct.cmdReverse['365D12DA'] = {
    name: 'p_rec_req[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Required Pac',
    ioBrokerType: 'number',
};
rct.cmdReverse['54829753'] = {
    name: 'p_rec_lim[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Max. battery to grid power',
    ioBrokerType: 'number',
};
rct.cmdReverse['5D0CDCF0'] = {
    name: 'p_rec_available[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Available Pac',
    ioBrokerType: 'number',
};
rct.cmdReverse['85886E2E'] = {
    name: 'p_rec_lim[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Max. compensation power',
    ioBrokerType: 'number',
};
rct.cmdReverse['8F0FF9F3'] = {
    name: 'p_rec_available[1]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Available battery to grid power',
    ioBrokerType: 'number',
};
rct.cmdReverse['9A67600D'] = {
    name: 'p_rec_lim[2]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Pac max.',
    ioBrokerType: 'number',
};
rct.cmdReverse['B45FE275'] = {
    name: 'p_rec_available[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'Available compensation power',
    ioBrokerType: 'number',
};
rct.cmdReverse['20FD4419'] = {
    name: 'prim_sm.island_next_repeat_timeout',
    type: 'FLOAT',
    unit: 's',
    description: 'Next island trial timeout',
    ioBrokerType: 'number',
};
rct.cmdReverse['3623D82A'] = {
    name: 'prim_sm.island_flag',
    type: 'UINT16',
    unit: '',
    description: 'Grid-separated',
    ioBrokerType: 'number',
};
rct.cmdReverse['5151D84C'] = {
    name: 'prim_sm.island_reset_retrials_counter_time',
    type: 'FLOAT',
    unit: 'min',
    description: 'Reset island trials counter in (by 0 not used)',
    ioBrokerType: 'number',
};
rct.cmdReverse['73E3ED49'] = {
    name: 'prim_sm.island_max_trials',
    type: 'UINT16',
    unit: '',
    description: 'Max island trials',
    ioBrokerType: 'number',
};
rct.cmdReverse['751E80CA'] = {
    name: 'prim_sm.island_reset_retrials_operation_time',
    type: 'FLOAT',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['5F33284E'] = {
    name: 'prim_sm.state',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C40D5688'] = {
    name: 'prim_sm.state_source',
    type: 'UINT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['C4D87E96'] = {
    name: 'prim_sm.island_retrials',
    type: 'UINT16',
    unit: '',
    description: 'Island trials counter',
    ioBrokerType: 'number',
};
rct.cmdReverse['E31F8B17'] = {
    name: 'prim_sm.Uzk_pump_grad[0]',
    type: 'FLOAT',
    unit: 'W',
    description: 'start power',
    ioBrokerType: 'number',
};
rct.cmdReverse['0104EB6A'] = {
    name: 'rb485.f_grid[2]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Grid phase 3 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['07367B64'] = {
    name: 'rb485.phase_marker',
    type: 'INT16',
    unit: '',
    description: 'Next phase after phase 1 in Power Switch',
    ioBrokerType: 'number',
};
rct.cmdReverse['173D81E4'] = {
    name: 'rb485.version_boot',
    type: 'UINT32',
    unit: '',
    description: 'Power Switch bootloader version',
    ioBrokerType: 'number',
};
rct.cmdReverse['21EE7CBB'] = {
    name: 'rb485.u_l_grid[2]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Grid phase 3 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['27650FE2'] = {
    name: 'rb485.version_main',
    type: 'UINT32',
    unit: '',
    description: 'Power Switch software version',
    ioBrokerType: 'number',
};
rct.cmdReverse['3B5F6B9D'] = {
    name: 'rb485.f_wr[0]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Power Storage phase 1 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['6FD36B32'] = {
    name: 'rb485.f_wr[1]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Power Storage phase 2 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['7A9091EA'] = {
    name: 'rb485.u_l_grid[1]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Grid phase 2 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['905F707B'] = {
    name: 'rb485.f_wr[2]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Power Storage phase 3 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['93F976AB'] = {
    name: 'rb485.u_l_grid[0]',
    type: 'FLOAT',
    unit: 'V',
    description: 'Grid phase 1 voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['9558AD8A'] = {
    name: 'rb485.f_grid[0]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Grid phase1 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['FAE429C5'] = {
    name: 'rb485.f_grid[1]',
    type: 'FLOAT',
    unit: 'Hz',
    description: 'Grid phase 2 frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['1FEB2F67'] = {
    name: 'switch_on_cond.u_min',
    type: 'FLOAT',
    unit: '',
    description: 'Min. voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['234DD4DF'] = {
    name: 'switch_on_cond.f_min',
    type: 'FLOAT',
    unit: '',
    description: 'Min. frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['3390CC2F'] = {
    name: 'switch_on_cond.test_time_fault',
    type: 'FLOAT',
    unit: 's',
    description: 'Switching on time after any grid fault',
    ioBrokerType: 'number',
};
rct.cmdReverse['362346D4'] = {
    name: 'switch_on_cond.max_rnd_test_time_fault',
    type: 'FLOAT',
    unit: 's',
    description: 'Max additional random switching on time after any grid fault',
    ioBrokerType: 'number',
};
rct.cmdReverse['4DB1B91E'] = {
    name: 'switch_on_cond.f_max',
    type: 'FLOAT',
    unit: '',
    description: 'Max. frequency',
    ioBrokerType: 'number',
};
rct.cmdReverse['934E64E9'] = {
    name: 'switch_on_cond.u_max',
    type: 'FLOAT',
    unit: '',
    description: 'Max. voltage',
    ioBrokerType: 'number',
};
rct.cmdReverse['ECABB6CF'] = {
    name: 'switch_on_cond.test_time',
    type: 'FLOAT',
    unit: '',
    description: 'Test time',
    ioBrokerType: 'number',
};
rct.cmdReverse['90B53336'] = {
    name: 'temperature.sink_temp_power_reduction',
    type: 'FLOAT',
    unit: '°C',
    description: 'Heat sink temperature target',
    ioBrokerType: 'number',
};
rct.cmdReverse['A7447FC4'] = {
    name: 'temperature.bat_temp_power_reduction',
    type: 'FLOAT',
    unit: '°C',
    description: 'Battery actuator temperature target',
    ioBrokerType: 'number',
};
rct.cmdReverse['06E03755'] = {
    name: 'wifi.ip',
    type: 'STRING',
    unit: '',
    description: 'IP Address',
    ioBrokerType: 'string',
};
rct.cmdReverse['14C0E627'] = {
    name: 'wifi.password',
    type: 'STRING',
    unit: '',
    description: 'WiFi password',
    ioBrokerType: 'string',
};
rct.cmdReverse['1D0623D6'] = {
    name: 'wifi.dns_address',
    type: 'STRING',
    unit: '',
    description: 'DNS address',
    ioBrokerType: 'string',
};
rct.cmdReverse['392D1BEE'] = {
    name: 'wifi.connect_to_server',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['53886C09'] = {
    name: 'wifi.connect_to_service',
    type: 'UINT8',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['57429627'] = {
    name: 'wifi.authentication_method',
    type: 'STRING',
    unit: '',
    description: 'WiFi authentication method',
    ioBrokerType: 'string',
};
rct.cmdReverse['5952E5E6'] = {
    name: 'wifi.mask',
    type: 'STRING',
    unit: '',
    description: 'Netmask',
    ioBrokerType: 'string',
};
rct.cmdReverse['5A316247'] = {
    name: 'wifi.mode',
    type: 'STRING',
    unit: '',
    description: 'WiFi mode',
    ioBrokerType: 'string',
};
rct.cmdReverse['6D7C0BF4'] = {
    name: 'wifi.sockb_port',
    type: 'INT32',
    unit: '',
    description: 'Port',
    ioBrokerType: 'number',
};
rct.cmdReverse['76CAA9BF'] = {
    name: 'wifi.encryption_algorithm',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['7B1F7FBE'] = {
    name: 'wifi.gateway',
    type: 'STRING',
    unit: '',
    description: 'Gateway',
    ioBrokerType: 'string',
};
rct.cmdReverse['7DDE352B'] = {
    name: 'wifi.sockb_ip',
    type: 'STRING',
    unit: '',
    description: '',
    ioBrokerType: 'string',
};
rct.cmdReverse['8CA00014'] = {
    name: 'wifi.result',
    type: 'INT8',
    unit: '',
    description: 'WiFi result',
    ioBrokerType: 'number',
};
rct.cmdReverse['907CD1DF'] = {
    name: 'wifi.connect_service_max_duration',
    type: 'INT32',
    unit: 's',
    description: 'Service connection max duration',
    ioBrokerType: 'number',
};
rct.cmdReverse['A1D2B565'] = {
    name: 'wifi.service_port',
    type: 'INT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['B4222BDE'] = { name: 'wifi.state', type: 'UINT8', unit: '', description: '', ioBrokerType: 'number' };
rct.cmdReverse['B7FEA209'] = {
    name: 'wifi.connect_service_timestamp',
    type: 'INT32',
    unit: '',
    description: 'Service auto disconnect time',
    ioBrokerType: 'number',
};
rct.cmdReverse['D83DC6AC'] = {
    name: 'wifi.server_port',
    type: 'INT32',
    unit: '',
    description: '',
    ioBrokerType: 'number',
};
rct.cmdReverse['F8DECCE6'] = {
    name: 'wifi.connected_ap_ssid',
    type: 'STRING',
    unit: '',
    description: 'WiFi associated AP',
    ioBrokerType: 'string',
};
rct.cmdReverse['F9FD0D61'] = {
    name: 'wifi.service_ip',
    type: 'STRING',
    unit: '',
    description: 'Server to connect to to wait for commands, usually used by the vendor service personell',
    ioBrokerType: 'string',
};
rct.cmdReverse['FF2A258B'] = {
    name: 'wifi.server_ip',
    type: 'STRING',
    unit: '',
    description: 'Server to connect to to wait for commands, usually used by the vendor service personell',
    ioBrokerType: 'string',
};

module.exports = rct;
