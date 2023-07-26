/**
 * These functions can provide Message VPN enable/shutdown.
 */


// I know this is really stupid but for a demo, enough.
function toggleHaru() {
    toggleVpnBrOp('haru');
}

function toggleNatsu() {
    toggleVpnBrOp('natsu');
}

function toggleAki() {
    toggleVpnBrOp('aki');
}

function toggleFuyu() {
    toggleVpnBrOp('fuyu');
}

function toggleVpnBrOp(vpnName) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://my-solace.mooo.com:8080/VpnBrOp/' + vpnName);
    //xhr.open('GET', 'http://localhost:8080/VpnBrOp/' + vpnName);
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