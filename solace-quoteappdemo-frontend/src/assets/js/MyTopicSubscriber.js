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
 * PublishSubscribe tutorial - Topic Subscriber
 * Demonstrates subscribing to a topic for direct messages and receiving messages
 */

/*jslint es6 browser devel:true*/
/*global solace*/

var MyTopicSubscriber = function () {
    "use strict";
    var subscriber = {};

    subscriber.session = null;
    subscriber.topicName = null;
    subscriber.subscribed = false;
    subscriber.isConnected = false;
    // Collect messages

    // Logger
    subscriber.log = function (line) {
        var now = new Date();
        console.log(now + "||" + line);
    };

    // Callback for message events
    subscriber.messageEventCb = function (session, message) {
        subscriber.log("Received msg: [" + message.getBinaryAttachment() + "]");
        //this.display("adminMsgPanel", message.getBinaryAttachment());
    };

    // Callback for session events
    subscriber.sessionEventCb = function (session, event) {
        subscriber.log(event.toString());
        switch (event.sessionEventCode) {
            case solace.SessionEventCode.UP_NOTICE:
                subscriber.log("=== Successfully connected ===");
                this.isConnected = true;
                break;
            case solace.SessionEventCode.CONNECTING:
                subscriber.log("=== Connecting... ===");
                break;
            case solace.SessionEventCode.DISCONNECTED:
                subscriber.log("=== Disconnected. ===");
                subscriber.subscribed = false;
                if (subscriber.session !== null) {
                    subscriber.session.dispose();
                    subscriber.session = null;
                }
                break;
            case solace.SessionEventCode.SUBSCRIPTION_ERROR:
                subscriber.log("=== Cannot subscribe: " + event.correlationKey + " ===");
                break;
            case solace.SessionEventCode.SUBSCRIPTION_OK:
                subscriber.log("=== Successfully connected ===");
                if (subscriber.subscribed) {
                    subscriber.subscribed = false;
                    subscriber.log("=== Successfully unsubscribed from topic: " + event.correlationKey + " ===");
                } else {
                    subscriber.subscribed = true;
                    subscriber.log("=== Successfully subscribed to topic: " + event.correlationKey + " ===");
                    subscriber.log("=== Ready to receive messages... ===")
                }
                break;
            default:
                subscriber.log("*** UNKNOWN ERROR:" + event.sessionEventCode + " ***");
        }
    };

    //Establish connection to Solace
    subscriber.connect = function (strHost, strVpn, strClientUsername, strPassword) {
        if (subscriber.session !== null) {
            subscriber.log("=== Already connected. ===");
        } else {
            subscriber.log("=== Connecting to Solace Router web messaging URL: " + strHost);
            var sessionProperties = new solace.SessionProperties();

            sessionProperties.url = "http://" + strHost;
            sessionProperties.vpnName = strVpn;
            sessionProperties.userName = strClientUsername;
            sessionProperties.password = strPassword;

            subscriber.session = solace.SolclientFactory.createSession(
                sessionProperties,
                new solace.MessageRxCBInfo(function (session, message) {
                    // calling callback for message events.
                    subscriber.messageEventCb(session, message);
                }, subscriber),
                new solace.SessionEventCBInfo(function (session, event) {
                    // calling callback for session events.
                    subscriber.sessionEventCb(session, event);
                }, subscriber)
            );

            try {
                subscriber.session.connect();
            } catch(error) {
                subscriber.log("*** Connect ERROR: " + error.toString() + "***");
            }
        }
    };

    subscriber.disconnect = function () {
        subscriber.log("=== Disconnecting from host:");
        if (subscriber.session !== null) {
            try {
                subscriber.session.disconnect();
                subscriber.session.dispose();
                subscriber.session = null;
                this.isConnected = false;
            } catch (error) {
                subscriber.log(error.toString);
            }
        } else {
            this.log("*** Not Connect to a Solace. ***");
        }
    };

    // Subscribe to topic on Solace
    subscriber.subscribe = function (topicName) {
        if (subscriber.session !== null) {
            if (subscriber.subscribed) {
                subscriber.log("=== Already Subscribed ===");
            } else {
                subscriber.log("Subscribing to :" + topicName);
                try {
                    subscriber.session.subscribe(
                        solace.SolclientFactory.createTopic(topicName),
                        false,
                        topicName,
                        10000
                    );
                } catch (error) {
                    subscriber.log("*** Subscribe ERROR: " + error.toString() + "***");
                }
            }
        }
    };

    // Unsubscribe from topic.
    subscriber.unsubscribe = function (topicName) {
        if (subscriber.session !== null) {
            if (!subscriber.subscribed) {
                subscriber.log("=== Unsubscribing from topic: " + topicName);
                try {
                    this.session.unsubscribe(
                        solace.SolclientFactory.createTopic(topicName),
                        false,
                        topicName,
                        10000
                    );
                } catch (error) {
                    subscriber.log("*** Unsubscribe ERROR: " + error.toString() + "***");
                }
            }
        }
    };

    return subscriber;
};
