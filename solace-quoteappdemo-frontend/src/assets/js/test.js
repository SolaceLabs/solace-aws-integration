/**
 * Created by hhjau on 2017/05/14.
 */

var iTotalClicks = 0;
var iLastClicked = 0;
var iTimeElapsed = 0;
var fClickSpeed = 0.0;
var oInfoTotalClicks = "infoTotalClicks";
var oInfoLastClicked = "infoLastClicked";
var oInfoClickSpeed = "infoClickSpeed";

function clickTest () {
    ++iTotalClicks;
    if (iTotalClicks <= 1) {
        iLastClicked = new Date();
        fClickSpeed = 1.0;
    }
    else {
        var iCurrentTime = new Date();
        iTimeElapsed = iCurrentTime - iLastClicked;
        fClickSpeed = (iTotalClicks / iTimeElapsed).toFixed(3);
        iLastClicked = iCurrentTime;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById(oInfoTotalClicks).innerText = iTotalClicks.toString();
    document.getElementById(oInfoLastClicked).innerText = iLastClicked.toString();
    document.getElementById(oInfoClickSpeed).innerText = fClickSpeed.toString();
}