/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var ledgerMgr = require("./ledgerMgr");

var PlatformBuilder = require("../../platform/PlatformBuilder.js");

var requtil = require("./requestutils");
var helper = require('../../helper.js')
var logger = helper.getLogger("main");
var http = require('http');



const burrowroutes = async function (app, pltfrm) {
  platform = await PlatformBuilder.build(pltfrm);

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
          number: result.BlockMeta.header.height.toString(),
          previous_hash: result.Block.header.last_block_id.hash,
          data_hash: result.BlockMeta.header.data_hash,
          transactions: result.Block.data.txs
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
    res.setHeader("Content-Type", "application/json");
     platform.getCurChannel(res);

  });
    

  app.get("/api/contract/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
      platform.getContract(channelName, async function (data) {
        res.send({
          status: 200,
          contract: data
        });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

  /***Node Status List
  GET /nodelist -> /api/nodesStatus
  curl -i 'http://<host>:<port>/api/nodesStatus/<channel>'
  Response:
  [
    {
      "status": "RUNNING",
      "server_hostname": "172.22.0.161:26656"
    }
  ]
  */
  app.get("/api/nodesStatus/:channel", function (req, res) {
    let channelName = req.params.channel;
    if (channelName) {
       platform.getNodesStatus(channelName,function (data) {
        res.send({ status: 200, nodes: data });
      });
    } else {
      return requtil.invalidRequest(req, res);
    }
  });

}

module.exports = burrowroutes;