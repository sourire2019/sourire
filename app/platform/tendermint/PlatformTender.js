/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var path = require("path");
var helper = require("../../helper.js");
var logger = helper.getLogger("platformtender");
var fs = require("fs-extra");
var config = require("./config.json");
var http = require('http');
var async = require('async');
var request = require('sync-request');
var url = require("url");
var Platform = require("../Platform");

class PlatformTender {
  constructor() {
    this.host = config["host"];
    this.port = config["port"];
    this.plf = config["plf"];
    this.baseurl = url.format({
    protocol:"http:",
    host:this.host + ":" + this.port,
    port:this.port
   });
  }

  getBlockByNumber(channelName, blockNumber) {
    let block =  Platform.getBlockByNumber(this.baseurl,channelName,blockNumber);
    let result = {
      'blockNum': block.block_meta.header.height,
      'txCount': block.block_meta.header.num_txs,
      'preHash': block.block.header.last_block_id.hash,
      'dataHash': block.block_meta.header.data_hash,
      'firstTxTimestamp': block.block_meta.header.time,
      'blockhash': block.block_meta.block_id.hash,
      'genesis_block_hash': block.block_meta.header.chain_id,
      'txs' : block.block.data.txs,
      'total_txs' : block.block_meta.header.total_txs
    };
    return result;
  }

  getChannels(res) {
    var optionsget = {   
      path : '/genesis' 
    };
    let resultdata =  Platform.getChannels(this.baseurl,optionsget.path) 
    let channels = [];  
    
    let result = JSON.parse(resultdata);
    channels.push({"channel_id" : result.result.genesis.chain_id});
    let response = {
      status: 200 };
    response["channels"] = [...new Set(channels)];
    res.send(response);
  }

  getCurChannel(res) {    
    var optionsget = {   
      path : '/genesis'
    };  
    let resultdata = JSON.parse( Platform.getCurChannel(this.baseurl,optionsget.path) ) ;
    res.send({"currentChannel" : resultdata.result.genesis.chain_id});   
  }

  getStatus() {
    let statusdata =JSON.parse(Platform.getStatus(this.baseurl)) ;
    let res = {
      "listenaddr": statusdata.result.node_info.listen_addr,
      "network" : statusdata.result.node_info.network,
      "latestblockheight" : statusdata.result.sync_info.latest_block_height
    }
    return res;
  }

  getnetInfo() {
      try{
        let path = "/net_info";
        let netinfo = [];
        let result = JSON.parse(Platform.getnetInfo(this.baseurl, path));
      	let netnodes = result.result.peers;
        if (netnodes) {
          for( var i = 0;i < netnodes.length;i++){
            netinfo.push({
              "listenaddr": netnodes[i].node_info.listen_addr,
              "network" : netnodes[i].node_info.network
            })
          }
        }
        return netinfo;
        // return Platform.getnetInfo(this.baseurl,path);
      } catch(err){
        console.log(err);
      }
  }

  getContract(channelName, cb) {
      Platform.getContract(channelName, cb);
  }

  getNodesStatus(channelName,cb){
      try {
      	var nodes = [];
      	var statusdata = this.getStatus();
      	var netinfo = this.getnetInfo();
      	if(statusdata) {
      		nodes.push({"status": "RUNNING","server_hostname": statusdata.listenaddr})
      	}
      	if(netinfo) {
      		for( var i = 0;i < netinfo.length;i++){
      			nodes.push({"status": "RUNNING","server_hostname": netinfo[i].listenaddr})
      		}
      	}
       cb(nodes);

      } catch(err) {
        console.log(err);
        logger.error(err)
        cb([])
    }
 }
}



module.exports = PlatformTender;