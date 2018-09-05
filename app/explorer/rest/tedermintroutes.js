/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var ledgerMgr = require("./ledgerMgr");

var PlatformBuilder = require("../../platform/PlatformBuilder.js");

var requtil = require("./requestutils");
var helper = require('../../helper.js')
var logger = helper.getLogger("main");
var http = require('http');



const tedermintroutes = async function (app, pltfrm) {
  platform = await PlatformBuilder.build(pltfrm);
  //statusMetrics = persistence.getMetricService();
  //crudService = persistence.getCrudService();

  app.get("/api/bai", function (req, res) {
    res.setHeader("Content-Type", "application/json");
 
        var optionsget = {  
            host : '172.22.0.160',  
            port : '26657',  
            path : '/status',  
            method : 'get'
        };  
    
        var reqGet = http.request(optionsget, function(resGet) {  
            resGet.on('data', function(d) {  
                res.send(d);  
            });  
        });  
   
        reqGet.end();  
   
        reqGet.on('error', function(e) {  
            console.error(e);  
        }); 
  });
  /***
      Block by number
      GET /api/block/getinfo -> /api/block
      curl -i 'http://<host>:<port>/api/block/<channel>/<number>'
      *
      */
  app.get("/api/block/:channel/:number", function (req, res) {
    let number = parseInt(req.params.number);
    let channelName = req.params.channel;
    if (!isNaN(number) && channelName) {
      var result = platform.getBlockByNumber(channelName, number);
        res.send({
          status: 200,
          number: result.block_meta.header.height.toString(),
          previous_hash: result.block.header.last_block_id.hash,
          data_hash: result.block_meta.header.data_hash,
          transactions: result.block.data.txs
        });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /**
      Return list of channels
      GET /channellist -> /api/channels
      curl -i http://<host>:<port>/api/channels
      Response:
      {
      "channels": [
          {
          "channel_id": "mychannel"
          }
      ]
      }
      */

  app.get("/api/channels", function (req, res) {
     res.setHeader("Content-Type", "application/json");
     platform.getChannels(res);
   });

  /**
  Return current channel
  GET /api/curChannel
  curl -i 'http://<host>:<port>/api/curChannel'
  */
  app.get("/api/curChannel", function (req, res) {
     res.setHeader("Content-Type", "application/json");
     platform.getCurChannel(res);
  });
  /**
  Return change channel
  POST /api/changeChannel
  curl -i 'http://<host>:<port>/api/curChannel'
  */
  app.get("/api/changeChannel/:channelName", async function (req, res) {
    res.send({ status: 200});
  });
    /**
      Chaincode list
      GET /chaincodelist -> /api/chaincode
      curl -i 'http://<host>:<port>/api/chaincode/<channel>'
      Response:
      [
        {
          "channelName": "mychannel",
          "chaincodename": "mycc",
          "path": "github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02",
          "version": "1.0",
          "txCount": 0
        }
      ]
    */

  app.get("/api/chaincode/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
      platform.getChaincode(channelName, async function (data) {
        res.send({
          status: 200,
          chaincode: data
        });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /***Peer Status List
  GET /peerlist -> /api/peersStatus
  curl -i 'http://<host>:<port>/api/peersStatus/<channel>'
  Response:
  [
    {
      "status": "RUNNING",
      "server_hostname": "172.22.0.161:26656"
    }
  ]
  */
  app.get("/api/peersStatus/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
       platform.getPeersStatus(channelName,function (data) {
        res.send({ status: 200, peers: data });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

}

module.exports = tedermintroutes;