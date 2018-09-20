/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var path = require("path");
var helper = require("../helper.js");
var logger = helper.getLogger("platformtender");
var fs = require("fs-extra");
var http = require('http');
var async = require('async');
var request = require('sync-request');
var url = require("url");


 function getBlockByNumber(baseurl,channelName, blockNumber) {
      try{
      	var urlre = url.resolve(baseurl,"/block?height=" + blockNumber);
        var res = request('GET', urlre);
        var resultdata = JSON.parse(res.getBody().toString());
        return resultdata.result;
      } catch(err){
        console.log(err);
      }

	}

 function getStatus(baseurl) {
      try{
      	var urlre = url.resolve(baseurl,"/status");
        var res = request('GET', urlre);
        var resultdata = res.getBody().toString();
        return resultdata;
      } catch(err){
        console.log(err);
      }
  }

 function getnetInfo(baseurl,path) {
      try{
      	var urlre = url.resolve(baseurl,path);
        var res = request('GET', urlre);
        var resultdata = res.getBody().toString();
        return resultdata;
      } catch(err){
        console.log(err);
      }
  }

 function getContract(channelName, cb) {
      try {
        var ContractArray = [];
        cb(ContractArray);
      } catch(err) {
        logger.error(err)
        cb([])
      }
  }

module.exports = {
  getBlockByNumber,
  getStatus,
  getnetInfo,
  getContract
};