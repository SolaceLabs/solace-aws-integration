/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Solace Systems Web Messaging API for JavaScript
 * PublishSubscribe tutorial - Topic Publisher
 * Demonstrates subscribing to a topic for direct messages and receiving messages
 */

/*jslint es6 browser devel:true */
/*global solace */

var MyTopicPublisher = function () {
  'use strict';
  var publisher = {}

  publisher.session = null
  publisher.topicName = null
  publisher.subscribed = false
  publisher.isConnected = false
  // Collect messages

  // Logger
  publisher.log = function (line) {
    var now = new Date()
    console.log(now + '||' + line)
  }

  // Callback for message events
  publisher.messageEventCb = function (session, message) {
    publisher.log('Received msg: [' + message.getBinaryAttachment() + ']')
    //this.display("adminMsgPanel", message.getBinaryAttachment());
  };

  // Callback for session events
  publisher.sessionEventCb = function (session, event) {
    publisher.log(event.toString())
    switch (event.sessionEventCode) {
      case solace.SessionEventCode.UP_NOTICE:
        publisher.log('=== Successfully connected ===')
        this.isConnected = true
        break;
      case solace.SessionEventCode.CONNECTING:
        publisher.log('=== Connecting... ===')
        break;
      case solace.SessionEventCode.DISCONNECTED:
        publisher.log('=== Disconnected. ===')
        publisher.subscribed = false
        if (publisher.session !== null) {
          publisher.session.dispose()
          publisher.session = null
        }
        break
      case solace.SessionEventCode.SUBSCRIPTION_ERROR:
        publisher.log('=== Cannot subscribe: ' + event.correlationKey + ' ===')
        break;
      case solace.SessionEventCode.SUBSCRIPTION_OK:
        publisher.log('=== Successfully connected ===')
        if (publisher.subscribed) {
          publisher.subscribed = false
          publisher.log('=== Successfully unsubscribed from topic: ' + event.correlationKey + ' ===')
        } else {
          publisher.subscribed = true
          publisher.log('=== Successfully subscribed to topic: ' + event.correlationKey + ' ===')
          publisher.log('=== Ready to receive messages... ===')
        }
        break
      default:
        publisher.log('*** UNKNOWN ERROR:' + event.sessionEventCode + ' ***')
    }
  }

  //Establish connection to Solace
  publisher.connect = function (strHost, strVpn, strClientUsername, strPassword) {
    if (publisher.session !== null) {
      publisher.log('=== Already connected. ===')
    } else {
      publisher.log('=== Connecting to Solace Router web messaging URL: ' + strHost)
      var sessionProperties = new solace.SessionProperties()

      sessionProperties.url = 'http://' + strHost
      sessionProperties.vpnName = strVpn
      sessionProperties.userName = strClientUsername
      sessionProperties.password = strPassword

      publisher.session = solace.SolclientFactory.createSession(
        sessionProperties,
        new solace.MessageRxCBInfo(function (session, message) {
          // calling callback for message events.
          publisher.messageEventCb(session, message)
        }, publisher),
        new solace.SessionEventCBInfo(function (session, event) {
          // calling callback for session events.
          publisher.sessionEventCb(session, event)
        }, publisher)
      )

      try {
        publisher.session.connect()
      } catch (error) {
        publisher.log('*** Connect ERROR: ' + error.toString() + '***')
      }
    }
  }

  publisher.disconnect = function () {
    publisher.log('=== Disconnecting from host:')
    if (publisher.session !== null) {
      try {
        publisher.session.disconnect()
        publisher.session.dispose()
        publisher.session = null
        this.isConnected = false
      } catch (error) {
        publisher.log(error.toString)
      }
    } else {
      this.log('*** Not Connect to a Solace. ***')
    }
  }

  // Publish a message
  // RawMessage is a generic text message.
  publisher.publish = function (topicName, rawMessage) {

  }

  /*
  // Subscribe to topic on Solace
  publisher.subscribe = function (topicName) {
      if (publisher.session !== null) {
          if (publisher.subscribed) {
              publisher.log("=== Already Subscribed ===");
          } else {
              publisher.log("Subscribing to :" + topicName);
              try {
                  publisher.session.subscribe(
                      solace.SolclientFactory.createTopic(topicName),
                      true,
                      topicName,
                      10000
                  );
              } catch (error) {
                  publisher.log("*** Subscribe ERROR: " + error.toString() + "***");
              }
          }
      }
  };

  // Unsubscribe from topic.
  publisher.unsubscribe = function (topicName) {
      if (publisher.session !== null) {
          if (publisher.subscribed) {
              publisher.log("=== Unsubscribing from topic: " + topicName);
              try {
                  this.session.unsubscribe(
                      solace.SolclientFactory.createTopic(topicName),
                      true,
                      topicName,
                      10000
                  );
              } catch (error) {
                  publisher.log("*** Unsubscribe ERROR: " + error.toString() + "***");
              }
          }
      }
  };
  */

  return publisher
};
