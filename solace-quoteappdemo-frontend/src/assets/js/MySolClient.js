const {
  Observable,
  fromEvent,
  BehaviorSubject
} = rxjs;

const {
  map,
  filter,
  switchMap
} = rxjs.operators;

var MySolClient = function () {
  "use strict";
  var solclient = {};

  solclient.session = null;
  solclient.topicName = null;
  solclient.subscribed = false;
  solclient.isConnected = false;
  solclient.clientName = '';
  // Session events
  solclient.onUpNotice = null;
  solclient.onConnectFailedError = null;
  solclient.onDisconnected = null;
  solclient.onSubscriptionError = null;
  solclient.onSubscriptionOk = null;
  solclient.onMessage = null;

  // Collect messages

  // Logger
  solclient.log = function (line) {
    var now = new Date();
    console.log(now + "||" + line);
  };

  // Initialize the connection
  // I don't provide the choice for users of this component, at least for now.
  solclient.initialize = function () {
    var factoryProps = new solace.SolclientFactoryProperties();
    factoryProps.profile = solace.SolclientFactoryProfiles.version10;
    solace.SolclientFactory.init(factoryProps);
    solclient.setDebugLevel(solace.LogLevel.INFO);
  };

  // setup the debug level, default is INFO.
  solclient.setDebugLevel = function (strDebugLevel) {
    solace.SolclientFactory.setLogLevel(strDebugLevel);
  };

  // assign clientName, this should not duplicate!
  solclient.setClientName = function (strClientName) {
    this.clientName = strClientName
  };

  //Establish connection to Solace
  solclient.connect = function (strHost, strVpn, strClientUsername, strPassword) {
    if (solclient.session !== null) {
      solclient.log('Already connected and ready to subscribe.');
      return;
    }
    var hosturl = strHost;
    var username = strClientUsername;
    var pass = strPassword;
    var vpn = strVpn;
    if (!hosturl || !username || !pass || !vpn) {
      solclient.log('Cannot connect: please specify all the Solace message router properties.');
      return;
    }
    solclient.log('Connecting to Solace message router using url: ' + hosturl);
    solclient.log('Client username: ' + username);
    solclient.log('Solace message router VPN name: ' + vpn);
    // create session
    try {
      solclient.session = solace.SolclientFactory.createSession({
        // solace.SessionProperties
        url: hosturl,
        vpnName: vpn,
        userName: username,
        password: pass,
        clientName: this.clientName
      });
      solclient.onUpNotice = fromEvent(solclient.session, solace.SessionEventCode.UP_NOTICE, (sEv) => ({
        sEv
      }));
      solclient.onDisconnected = fromEvent(solclient.session, solace.SessionEventCode.DISCONNECTED, (sEv) => ({
        sEv
      }));
      solclient.onConnectFailedError = fromEvent(solclient.session, solace.SessionEventCode.CONNECT_FAILED_ERROR, (sEv) => ({
        sEv
      }));
      solclient.onSubscriptionOk = fromEvent(solclient.session, solace.SessionEventCode.SUBSCRIPTION_OK, (sEv) => ({
        sEv
      }));
      solclient.onSubscriptionError = fromEvent(solclient.session, solace.SessionEventCode.SUBSCRIPTION_ERROR, (sEv) => ({
        sEv
      }));
      solclient.onMessage = fromEvent(solclient.session, solace.SessionEventCode.MESSAGE, (msg) => ({
        msg
      }));
      // Register default callback functions.
      solclient.registerDefaultCallback();
      solclient.session.connect();
      // this.isConnected = true;
      //solclient.log();

    } catch (error) {
      solclient.log(error.toString());
    }
  };

  solclient.disconnect = function () {
    solclient.log("=== Disconnecting from Solace... ===");
    if (solclient.session !== null) {
      try {
        solclient.session.disconnect();
        this.isConnected = false;
      } catch (error) {
        solclient.log(error.toString);
      }
    } else {
      this.log("*** Not Connect to a Solace. ***");
    }
  };

  // Subscribe to topic on Solace
  solclient.subscribe = function (topicName) {
    if (solclient.session !== null) {
      if (solclient.subscribed) {
        solclient.log("=== Already Subscribed ===");
      } else {
        solclient.log("Subscribing to :" + topicName);
        try {
          solclient.session.subscribe(
            solace.SolclientFactory.createTopic(topicName),
            true,
            topicName,
            10000
          );
        } catch (error) {
          solclient.log("*** Subscribe ERROR: " + error.toString() + "***");
        }
      }
    }
  };

  // Unsubscribe from topic.
  solclient.unsubscribe = function (topicName) {
    if (solclient.session !== null) {
      if (!solclient.subscribed) {
        solclient.log("=== Unsubscribing from topic: " + topicName);
        try {
          this.session.unsubscribe(
            solace.SolclientFactory.createTopic(topicName),
            true,
            topicName,
            10000
          );
        } catch (error) {
          solclient.log("*** Unsubscribe ERROR: " + error.toString() + "***");
        }
      }
    }
  };

  // Define default callback functions
  solclient.registerDefaultCallback = function () {
    // define session event listeners
    solclient.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
      solclient.log('=== Successfully connected and ready to subscribe. ===');
      solclient.isConnected = true;
    });
    solclient.session.on(solace.SessionEventCode.CONNECT_FAILED_ERROR, function (sessionEvent) {
      solclient.log('Connection failed to the message router: ' + sessionEvent.infoStr +
        ' - check correct parameter values and connectivity!');
    });
    solclient.session.on(solace.SessionEventCode.DISCONNECTED, function (sessionEvent) {
      solclient.isConnected = false;
      if (solclient.session !== null) {
        solclient.session.dispose();
        solclient.session = null;
      }
      solclient.log('Disconnected.');
    });
    solclient.session.on(solace.SessionEventCode.SUBSCRIPTION_ERROR, function (sessionEvent) {
      solclient.log('Cannot subscribe to topic: ' + sessionEvent.correlationKey);
    });
    solclient.session.on(solace.SessionEventCode.SUBSCRIPTION_OK, function (sessionEvent) {
      solclient.log('Successfully processed subscription: ' + sessionEvent.correlationKey);
    });
    // define message event listener
    solclient.session.on(solace.SessionEventCode.MESSAGE, function (message) {
      /*
      solclient.log('Received message: "' + message.getBinaryAttachment() +
        '", details:\n' +
        message.dump());*/
    });
  }

  return solclient;
};
