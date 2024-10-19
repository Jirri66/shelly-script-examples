/**
 * @copyright shelly-tools contributors
 * @license   GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0.de.html)
 * @authors   https://github.com/shelly-tools/shelly-script-examples/graphs/contributors
 *
 * This script is intended to control a Shelly RGBW2 / ShellyDuo RGBW with a single button from
 * a Shelly Plus device. Every time the button from the Plus device is pushed it jumps to the next step 
 * defined in the sequence array. 
 */
 
// CONFIG START
// IP address or hostname from RGBW device
let REMOTE = {
    ip: '192.168.178.92',
    input: 3, // ID from the push button: 0 for Shelly Plus 1 / Plus 1 PM or 0,1,2 or 3 for the Shelly I4.
};

// button sequence 
// The demo sequence is: on white with 50% brightness, then blue, red, green, yellow, purple
let colorsequence = [
   '?turn=on&gain=50&blue=0&red=0&green=0&white=255', // warm white
   '?turn=on&gain=50&blue=255&red=0&green=0&white=0', // blue
   '?turn=on&gain=50&blue=0&red=255&green=0&white=0', // red
   '?turn=on&gain=50&blue=0&red=0&green=255&white=0', // green
   '?turn=on&gain=50&blue=0&red=255&green=255&white=0', // yellow
   '?turn=on&gain=50&blue=225&red=185&green=76&white=0', // purple
];

// Dimming level for the related color
let dimsequence = [
   '?gain=33', // 33%
   '?gain=20', // 20%
   '?gain=5', // 5%
   '?gain=100', // 100%
   '?gain=50', // 50%
];
// CONFIG END 

// no need to change anything below this line..
let colorposition = 0;
let dimpos = 0;

// add an evenHandler for button type input and various push events
Shelly.addEventHandler(
    function (event, user_data) {
        //print(JSON.stringify(event));
        if (typeof event.info.event !== 'undefined') {
           
            if (event.info.event === 'double_push'&& event.info.id === REMOTE.input) {
                setRGBW(REMOTE.ip, colorposition);
                
                colorposition++;
                dimpos = 0;
                if (colorsequence.length === colorposition) {
                  colorposition = 0;
                }

           } else if (event.info.event === 'single_push'&& event.info.id === REMOTE.input){
               toggleRGBW(REMOTE.ip);

           } else if (event.info.event === 'long_push'&& event.info.id === REMOTE.input) {
               dimRGBW(REMOTE.ip, dimpos);
               dimpos++;
               if (dimsequence.length === dimpos) {
                 dimpos = 0;
               }

           } else {
             return true;
           }
        } else {
            return true;
        }
    },
);

// send RBGW command 
function setRGBW(ip, colorposition) {
    Shelly.call(
        "http.get", {
            url: 'http://' + ip + '/light/0' + colorsequence[colorposition]
        },
        function (response, error_code, error_message, ud) {
            print(colorsequence[colorposition]);
        },
        null
    );
};

 // send RBGW dimming command 
 function dimRGBW(ip, dimpos) {
   Shelly.call(
       "http.get", {
           url: 'http://' + ip + '/light/0' + dimsequence[dimpos]
       },
       function (response, error_code, error_message, ud) {
           print(dimsequence[dimpos]);
       },
       null
   );
};
function toggleRGBW(ip) {
   Shelly.call(
       "http.get", {
           url: 'http://' + ip + '/light/0?turn=toggle'
       },
       function (response, error_code, error_message, ud) {
       },
       null
   );
}
