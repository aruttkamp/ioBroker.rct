# Older changes
## 1.2.22 (2025-06-02)
* (Andreas Ruttkamp) update deps
* (Andreas Ruttkamp) testing node24 implemented

## 1.2.21 (2025-05-04)
* (Andreas Ruttkamp) update deps
* (Andreas Ruttkamp) minimum node.js version changed to 20

## 1.2.19 (2025-04-01)
* (Andreas Ruttkamp) update deps
* (Andreas Ruttkamp) minimum version for admin now 7.4.10

## 1.2.18 (2025-02-24)
* (NCIceWolf) Debug mode in Admin added
* (NCIceWolf) update dependencies

## 1.2.17 (2025-01-01)
* (Andreas Ruttkamp) update deps
* (Andreas Ruttkamp) update copyright

## 1.2.16 (2024-12-16)
* (NCIceWolf) Changed admin to type "panel"

## 1.2.15 (2024-12-15)
* (Andreas Ruttkamp) update deps
* (Andreas Ruttkamp) include node.js 22 testing
* (Andreas Ruttkamp) IMPLEMENTING eslint 9

## 1.2.14 (2024-09-13)
* (Andreas Ruttkamp) removed .npmignore

## 1.2.13 (2024-07-17)
* (NCIceWolf) Added multiple debugging messages
* (NCIceWolf) Corrected debug messages to be shown as debug, not info
* (NCIceWolf) corrected connection abortion if not successfully established
* (NCIceWolf) elements from inverter are only requested once a connection is successfully established
* (NCIceWolf) added requested and received elements to/from inverter to debug logging
* (NCIceWolf) merged recent dependabot suggestions   
* (Andreas Ruttkamp) Dependabot suggested updates
* (Andreas Ruttkamp) some Code cosmetics

## 1.2.12 (2024-07-03)
* (Andreas Ruttkamp) Dependabot suggested updates
* (NCIceWolf) Improving connectivity to inverter

## 1.2.11 (2024-06-28)
* (NCIceWolf) mistyping corrected

## 1.2.10 (2024-06-28)
* (NCIceWolf) stability improvements for data connection to inverter
* (Andreas Ruttkamp) some code corrections

## 1.2.9 (2024-05-17)
* (Andreas Ruttkamp) wrong type for next_calib_date corrected

## 1.2.8 (2024-05-16)
* (NCIceWolf) Implementation of new adminUI
* (Andreas Ruttkamp) index_m.html deleted
* (Andreas Ruttkamp) Datatype battery_stack_cycles corrected
* (NCIceWolf) style.css deleted (not needed for json admin)
* (NCIceWolf) removed tab-materialize (leftover from initial adapter creation)
* (NCIceWolf) updated minimum js-controller version to >= 5.0.0
* (NCIceWolf) added minimum admin version to >= 5.0.0
* (NCIceWolf) prepared translations for adminUI

## 1.2.7 (2024-05-05)
* (Andreas Ruttkamp) prim_sm.state added
* (NCIceWolf) handling of type errors added
* (Andreas Ruttkamp) some Code cleaning
* (NCIceWolf) Update io-package.json

## 1.2.6 (2024-05-03)
* (Andreas Ruttkamp) unused parameter deleted

## 1.2.5 (2024-05-02)
* (Andreas Ruttkamp) misspelling in rct_core2 corrected
* (Andreas Ruttkamp) Missing ack:true added ( issue:#89)
* (Andreas Ruttkamp) datatypes corrected ( issue:#106)
* (NCIceWolf) changes to correct loosing connection ( issue:#114 )

## 1.2.4 (2024-02-09)
* (Andreas Ruttkamp) adapter not running in 1.2.3 - fixed

## 1.2.3 (2024-02-09)
* (Andreas Ruttkamp) prim_sm.state added
* (Andreas Ruttkamp) states for battery added
* (Andreas Ruttkamp) output of data points power_mng.soc_min and soc_min_island corrected

## 1.2.2 (2023-09-13)
* (Andreas Ruttkamp) data type for power_mng.bat_next_calib_date corrected
* (Andreas Ruttkamp) data type for battery.stack_cycles[x] corrected

## 1.2.1 (2023-09-13)
* (Andreas Ruttkamp) configured rct elements will now be used correctly ( in 1.2.0 only power_mng.bat_next_calib_date was read)

## 1.2.0 (2023-09-11)
* (Andreas Ruttkamp) connection state corrected when adapter is stopped
* (Andreas Ruttkamp) dependancies updated

## 1.1.7 (2023-08-30)
* (Andreas Ruttkamp) connection state corrected

## 1.1.6 (2023-08-23)
* (Andreas Ruttkamp) rct_core.js deleted (now rct_core2 is used)
* (Andreas Ruttkamp) parameters in default setting deleted 
* (Andreas Ruttkamp) min. Node 18

## 1.1.5 (2023-08-18)
* (Andreas Ruttkamp) Fix: crash reading UInt8 corrected
* (Andreas Ruttkamp) some cleaning actions

## 1.1.4 (2023-08-18)
* (Andreas Ruttkamp) Fix: proofments corrected.

## 1.1.3 (2023-08-18)
* (Andreas Ruttkamp) Fix: more data checks implemented

## 1.1.2 (2023-08-17)
* (Andreas Ruttkamp) Fix: adapter crashes

## 1.1.1 (2023-08-17)
* (Andreas Ruttkamp) data for g_sync.p_ac_load[0-2] / dc_conv.dc_conv_struct[0-1].u_sg_lp added
* (Andreas Ruttkamp) more parameters added 
* (Andreas Ruttkamp) date conversions fixed
* (Andreas Ruttkamp) conversions of percentages fixed
* (Andreas Ruttkamp) instance crash if data failure fixed

## 1.0.5 (2023-07-29)
* (Andreas Ruttkamp) some internal work
* (Andreas Ruttkamp) preparation for new admin
* (Andreas Ruttkamp) dependecies update

## 1.0.4 (2023-04-24)
* (Andreas Ruttkamp) Release Script added and update dev-components
* (Andreas Ruttkamp) Preparation of new backend

## 1.0.3 (2023-03-30)
* (Andreas Ruttkamp) Release Script added and update dev-components

## 1.0.1
* (Markus Lauff) fixing review comments - thanks to Apollon77

## 1.0.0
* (Markus Lauff) 0.0.6 version proved stable and fulfilling minimal functional requirements, so releasing it as version 1.0.0 for productive usage

## 0.0.6
* (Markus Lauff) adding further channels/states, major stability improvements

## 0.0.5
* (Markus Lauff) some fixes / minor improvements

## 0.0.1
* (Markus Lauff) initially bare minimum working release
