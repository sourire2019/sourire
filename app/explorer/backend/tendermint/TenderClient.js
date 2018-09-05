/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var WebSocketClient = require('websocket').client
var crypto = require("crypto");
var config = require("../../../platform/tendermint/config.json");
var SynBlockData = require('./SynBlockData');


class TenderClient {
    constructor(platform, persistence, broadcaster) {
        this.addr = "ws://"+ config["host"] + ":" + config["port"] + "/websocket";
        this.platform = platform;
        this.persistence = persistence;
        this.broadcaster = broadcaster;
    }

    async connectserver() {
        var client = new WebSocketClient();
        var myInterval;
        var addr = this.addr;
        var blockScanner = new SynBlockData(this.platform, this.persistence, this.broadcaster);
        var reconnect = false;

        client.on('connectFailed', function(error) {
          console.log('Connect Error: ' + error.toString());
        });

        client.on('connect', function(connection) {
          clearInterval(myInterval);

          if (reconnect) {
            blockScanner.syncBlock();
          }

          var str = '{"jsonrpc":"2.0","id":"ws-client","method":"subscribe","params":{"query":"tm.event=\'NewBlockHeader\'"}}';

          connection.send(str);


          console.log('WebSocket client connected');
          connection.on('error', function(error) {
          console.log("Connection Error: " + error.toString());
          });
          connection.on('close', function() {
          console.log('echo-protocol Connection Closed');
          reconnet = true;
          myInterval = setInterval(function () {
            console.log('reconnet...................');
            client.connect(addr);          
          }, 10000);
          });
          connection.on('message', function(message) {
            if (message.type === 'utf8') {
            var blockHeader = JSON.parse(message.utf8Data);
            if(blockHeader.result.data) {
              if(blockHeader.result.data.value.header.height) {
                var height = blockHeader.result.data.value.header.height;
                console.log(blockHeader.result.data.value.header.height);
                blockScanner.syncBlockByNumber(parseInt(height));
              }
            }
            console.log("Received: '" + message.utf8Data + "'");
            }
          });
        });
        client.connect(addr);

    }
}

module.exports = TenderClient;