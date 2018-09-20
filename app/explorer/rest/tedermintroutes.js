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


  app.get("/api/channels", function (req, res) {
     res.setHeader("Content-Type", "application/json");
     platform.getChannels(res);
   });

  app.get("/api/curChannel", function (req, res) {
     res.setHeader("Content-Type", "application/json");
     platform.getCurChannel(res);
  });
 
  app.get("/api/changeChannel/:channelName", async function (req, res) {
    // res.send({ status: 200});
    res.send({ "currentChannel": "chain-U7Evx6"})
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

module.exports = tedermintroutes;