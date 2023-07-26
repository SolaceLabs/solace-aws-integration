/**
 * These functions can provide Message VPN enable/shutdown.
 */

function changeSpeed(vpnName) {
    var sSpeed = document.querySelector('input[name=' + vpnName + '-options' + ']:checked').value;
    //alert('VPN: ' + vpnName + ', speed: ' + sSpeed);
    shiftSpeedOp(vpnName, sSpeed);
}

function shiftSpeedOp(vpnName, speed) {
    var xhr = new XMLHttpRequest();
    // backendUrl is injected from application.properties
    xhr.open('GET', backendUrl + vpnName + '?speed=' + speed);
    //xhr.open('GET', 'http://localhost:8080/ShiftSpeedOp/' + vpnName + '?speed=' + speed);
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Got 200: ' + xhr.responseText);
        }
        else if (xhr.status !== 200) {
            console.log('Got ' + xhr.status);
        }
    };
    xhr.send();
}
