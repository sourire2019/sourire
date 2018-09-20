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
      try{
        return  Platform.getBlockByNumber(this.baseurl,channelName,blockNumber);
      } catch(err){
        console.log(err);
      }

	}

  getChannels(res) {
  	var channels = [];
  	var optionsget = {  
            host : this.host,  
            port : this.port,  
            path : '/genesis',  
            method : 'get'  
        };
    
    var reqGet = http.request(optionsget, function(resGet) {  
            resGet.on('data', function(d) {
            	var resultdata = JSON.parse(d);
            	channels.push({"channel_id" : resultdata.result.genesis.chain_id});
                var response = {
                    status: 200 };
                response["channels"] = [...new Set(channels)];
                res.send(response);
            });  
        });  
   
    reqGet.end();  
   
    reqGet.on('error', function(e) {  
            console.error(e);  
        });    
  }

  getCurChannel(res) {  	
  	var optionsget = {  
            host : this.host,  
            port : this.port,  
            path : '/genesis',  
            method : 'get'  
        };  
    
    var reqGet = http.request(optionsget, function(resGet) {  
            resGet.on('data', function(d) {
            	var resultdata = JSON.parse(d);
            	res.send({"currentChannel" : resultdata.result.genesis.chain_id});
            });  
        });  
   
    reqGet.end();  
   
    reqGet.on('error', function(e) {  
            console.error(e);  
        });    
  }

  getStatus() {
      try{
      	return Platform.getStatus(this.baseurl);
      } catch(err){
        console.log(err);
      }
  }

  getnetInfo() {
      try{
        let path = "/net_info";
      	
        return Platform.getnetInfo(this.baseurl,path);
      } catch(err){
        console.log(err);
      }
  }

  getContract(channelName, cb) {
      try {
        Platform.getContract(channelName,cb);
      } catch(err) {
        logger.error(err)
        cb([])
      }
  }

  getNodesStatus(channelName,cb){
      try {
      	var nodes = [];
      	var statusdata = JSON.parse(this.getStatus());
      	var netinfo = JSON.parse(this.getnetInfo());
      	if(statusdata) {
      		nodes.push({"status": "RUNNING","server_hostname": statusdata.result.node_info.listen_addr})
      	}
      	if(netinfo) {
      		var netnodes = netinfo.result.peers;
      		for( var i = 0;i < netnodes.length;i++){
      			nodes.push({"status": "RUNNING","server_hostname": netnodes[i].node_info.listen_addr})
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