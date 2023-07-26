/**
 * Created by coolguy on 4/26/17.
 */

var isSubscribed = false
var isConnected = false
var subscriber = null
var msgArray = new Array()
var msgNum = 0
var iMdMsgNum = 0
var iLastMsgReceivedNum = 0
var iMdTotalBwUsage = 0
var fMdTotalBwUsage = 0.0
var sBwUnit = ''
var funcCalcMdRate
const BW_1K = 1024
const BW_1M = BW_1K * 1024
const BW_1G = BW_1M * 1024
const MD_RATE_SAMPLING_INTERVAL = 3000 // milliseconds
const MAX_MSG_NUM = 8
const MSG_PANEL_ID = 'adminMsgPanel'
const TOPIC_PREFIX = 'D/TWSE/'
const TXT_CONNECTING = 'Connecting...'
const TXT_CONNECT = 'Connect'
const TXT_DISCONNECTING = 'Stopping...'
const TXT_DISCONNECT = 'Disconnect'
const TXT_REMIND_TO_SELECT = 'Please click on the symbol name to subscribe realtime data'

// Display messages on msgPanel
function display (msgPanelId, msg) {
  if (msgNum === 0) {
    document.getElementById(msgPanelId).innerHTML = '';
  }
  // Counting the messages
  var tempStr = ''

  if ((msgNum + 1) >= MAX_MSG_NUM) {
    for (var i = 0; i < msgNum - 1; i++) {
      msgArray[i] = msgArray[i + 1]
    }
    msgArray[MAX_MSG_NUM - 1] = msg
    msgNum = MAX_MSG_NUM
  } else {
    msgArray[msgNum] = msg
    msgNum++
  }

  for (var i = 0; i < msgArray.length; i++) {
    if (msgArray[i] !== undefined) {
      if (i == (msgNum - 1))
        {tempStr = "<p class='text-success'>" + msgArray[i] + "</p>" + tempStr + "\n";}
      else
        {tempStr = "<p class='text-muted'>" + msgArray[i] + "</p>" + tempStr + "\n";}
    }
  }
  document.getElementById(msgPanelId).innerHTML = tempStr
}

function updateVolume (symbolId, md) {
  // console.log(symbolId);
  document.getElementById(symbolId).innerHTML = md
}

function updateGenericValue (symbolId, md) {
  // console.log(symbolId);
  document.getElementById(symbolId).innerHTML = md
}

function updatePriceClose (symbolId, md, pDiff) {
  var tmpPrice = parseFloat(pDiff)
  var strDisplayClass = ''

  if (tmpPrice > 0.0) {
    strDisplayClass = 'btn btn-danger';
  } else if (tmpPrice < 0.0) {
    strDisplayClass = 'btn btn-success';
  } else {
    strDisplayClass = 'btn btn-outline-primary';
  }
  document.getElementById(symbolId).innerHTML = "<span class='" + strDisplayClass + "'>" + md + '</span>'
}

function updatePriceDiff (symbolId, md) {
  // console.log(symbolId);
  var tmpPrice = parseFloat(md)
  var strDisplayClass = ''

  if (tmpPrice > 0.0) {
    strDisplayClass = 'btn btn-danger';
  } else if (tmpPrice < 0.0) {
    strDisplayClass = 'btn btn-success';
  } else {
    strDisplayClass = 'btn btn-outline-primary';
  }
  document.getElementById(symbolId).innerHTML = "<span class='" + strDisplayClass + "'>" + md + '</span>'
}

// 每隔一段時間計算一次手機的行情速率與使用頻寬
function calcMdRate () {
  var iMsgNumInInterval = iMdMsgNum - iLastMsgReceivedNum
  var fMdMsgRate = (iMsgNumInInterval / MD_RATE_SAMPLING_INTERVAL) * 1000

  // Since we used milliseconds, we should multiply this by 1000
  updateGenericValue('DEVICE_MD_RATE', fMdMsgRate.toPrecision(5))
  iLastMsgReceivedNum = iMdMsgNum
  // calculate bw usage.
  if (iMdTotalBwUsage > BW_1G) {
    fMdTotalBwUsage = iMdTotalBwUsage / BW_1G
    sBwUnit = 'G'
  } // 1G
  else if (iMdTotalBwUsage > BW_1M) {
    fMdTotalBwUsage = iMdTotalBwUsage / BW_1M
    sBwUnit = 'M'
  } // 1M
  else if (iMdTotalBwUsage > BW_1K) {
    fMdTotalBwUsage = iMdTotalBwUsage / BW_1K
    sBwUnit = 'K'
  } // 1K
  updateGenericValue('DEVICE_BW_USAGE', fMdTotalBwUsage.toPrecision(5) + sBwUnit)

  funcCalcMdRate = setTimeout(calcMdRate, MD_RATE_SAMPLING_INTERVAL)
}

function connectToBackend () {
  // enable logging to JavaScript console at INFO level
  // NOTICE: works only with "lib/solclient-debug.js"
  var factoryProps = new solace.SolclientFactoryProperties()

  factoryProps.logLevel = solace.LogLevel.INFO
  solace.SolclientFactory.init(factoryProps)
  // create the subscriber, specifying name of the subscription topic
  // subscriber = new MyTopicSubscriber("logistics/>");
  subscriber = new MyTopicSubscriber()
  // Define my own message handling
  subscriber.messageEventCb = function (session, message) {
    var arMdRawData = message.getBinaryAttachment().split('|')
    if (arMdRawData[0].indexOf('EXM') > 0) {
      console.log(arMdRawData[0])
      display(MSG_PANEL_ID, message.getBinaryAttachment())
      // Display the current Match Engine Rate
      if (arMdRawData[0].indexOf('EXM000101') > 0 || arMdRawData[0].indexOf('EXM000110') > 0) {
        updateGenericValue(arMdRawData[1], arMdRawData[2])
      }
    } else {
      // display(MSG_PANEL_ID, message.getBinaryAttachment());
      // console.log(arMdRawData[1] + ", " + arMdRawData[10] + ", " + arMdRawData[8]);
      iMdMsgNum++
      iMdTotalBwUsage = iMdTotalBwUsage + message.getBinaryAttachment().length
      updateVolume(arMdRawData[1] + '-vTotal', arMdRawData[10])
      updatePriceClose(arMdRawData[1] + '-pClose', arMdRawData[7], arMdRawData[8])
      updatePriceDiff(arMdRawData[1] + '-pDiff', arMdRawData[8])
    }
  }
  // This will use the global variable fetched from server to login to Solace.
  var strSolaceClientUserName = 'guest-mobile'
  var strSolaceVpnName = 'test01'
  if (mySolaceClientUserName != null) {
    strSolaceClientUserName = 'user-' + mySolaceClientUserName
  }
  if (mySolaceVpnName != null) {
    strSolaceVpnName = mySolaceVpnName
  }

  console.log('SolaceClientUserName: ' + strSolaceClientUserName + '@' + strSolaceVpnName)
  subscriber.connect('jj-solace1.mooo.com', strSolaceVpnName, strSolaceClientUserName, 'password')

  var count = 0

  function checkConnectionStatus () {
    count++
    console.log('Trying to subscribe: ' + count)
    if (subscriber.isConnected) {
      // subscriber.subscribe("D/TWSE/*");
      subscriber.subscribe('TWSE/>')
      isConnected = subscriber.isConnected
      if (isConnected) {
        this.display(MSG_PANEL_ID, 'Connected to SolEx backend @ ' + new Date())
      } else {
        this.display(MSG_PANEL_ID, 'Failed connecting to SolEx backend! Please contact Support.')
      }
    } else {
      setTimeout(checkConnectionStatus, 1500)
    }
  }
  checkConnectionStatus()
}

function subscribeTopic (strTopic) {
  if (subscriber.isConnected) {
    subscriber.subscribe(strTopic)
    console.log('Subscribed: ' + strTopic)
  }
}

function unsubscribeTopic (strTopic) {
  if (isConnected) {
    subscriber.unsubscribe(strTopic)
    console.log('Unsubscribed: ' + strTopic)
  }
}

// TODO: Improve the error handling while user clicks the checkboxed very fast!
function symbolClick (symbolObj) {
  // symbolObj must be a "checkbox" input.
  // console.log("Clicking: " + symbolObj.value + ", checked:" + symbolObj.checked);
  if (symbolObj.checked) {
    subscribeTopic(TOPIC_PREFIX + symbolObj.value)
  } else {
    unsubscribeTopic(TOPIC_PREFIX + symbolObj.value)
  }
}

function btnStartClick (btn) {
  if (isConnected) {
    btn.innerText = TXT_DISCONNECTING
    this.display(MSG_PANEL_ID, 'Disconnecting to SolEx backend @ ' + new Date())
    subscriber.unsubscribe('D/TWSE/*')
    // 停止計算行情相關的數據
    clearTimeout(funcCalcMdRate)
    // setTimeout(subscriber.disconnect, 3888);
    subscriber.disconnect()
    // TODO: Not a good statement here.
    isConnected = subscriber.isConnected
    if (!isConnected) {
      this.display(MSG_PANEL_ID, 'Disconnected to SolEx backend @ ' + new Date())
      btn.innerText = TXT_CONNECT
    } else {
      this.display(MSG_PANEL_ID, 'Failed disconnecting to SolEx backend! Please contact Support.')
    }
    // isSubscribed = false;
  } else {
    this.display(MSG_PANEL_ID, 'Connecting to SolEx backend @ ' + new Date())
    btn.innerText = TXT_CONNECTING
    connectToBackend()
    alert(TXT_REMIND_TO_SELECT)
    btn.innerText = TXT_DISCONNECT
    calcMdRate()
  }
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomSerialNum () {
  var dateObj = new Date()
  // var month = dateObj.getUTCMonth() + 1; //months from 1-12
  // var day = dateObj.getUTCDate();
  // var year = dateObj.getUTCFullYear();
  var hour = dateObj.getHours()
  var minute = dateObj.getMinutes()
  var second = dateObj.getSeconds()

  var randomSerialNum = '' + hour + minute + second

  return randomSerialNum
}

function formatNumber (myNum, padNum) {
  var output = myNum + ''

  while (output.length < padNum) {
    output = '0' + output
  }
  return output
}
