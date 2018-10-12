/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var path = require('path')
var helper = require('../../helper.js')
var logger = helper.getLogger('platformtender')
var fs = require('fs-extra')
var config = require('./config.json')
var http = require('http')
var async = require('async')
var request = require('sync-request')
var url = require('url')
var Platform = require('../Platform')

class PlatformJustitia {
  constructor () {
    this.host = config['host']
    this.port = config['port']
    this.plf = config['plf']
    this.baseurl = url.format({
      protocol: 'http:',
      host: this.host + ':' + this.port,
      port: this.port
    })
  }


  getChannels (res) {
    var channels = this.getJustchannels()
    channels.push({ 'channel_id': channels[0].name })
    let response = {
      status: 200 }
    response['channels'] = [...new Set(channels)]
    res.send(response)
  }

  getCurChannel (res) {
    var channels = this.getJustchannels()
    res.send({ 'currentChannel': channels[0].name })
  }



  getJustBalance (channelName, hash) {
    try {
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc": "2.0", "method": "eth_getBalance", "id": 1, "params": [hash,"latest"]},
      });

      let data = JSON.parse(result.getBody().toString())
      let res = parseInt(data.result,16)
      return res;
    } catch (err) {
      console.log(err)
    }
  }

  getJustReceiptByHash (channelName, hash) {
    try {
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "id": 1, "params": [hash]},
      });

      let data = JSON.parse(result.getBody().toString())
      let res = data.result.contractAddress
      return res;
    } catch (err) {
      console.log(err)
    }
  }


  getJustBlockByNumber (channelName, number) {
    try {
      var num=parseInt(number);
      var oxNum=num.toString(16);
      var blockNumber = "0x" + oxNum
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc": "2.0", "method": "eth_getBlockByNumber", "id": 1, "params": [blockNumber,true]},
      });

      let data = JSON.parse(result.getBody().toString())
      var txCount = 0
      if (data.result.transactions) {
        txCount = data.result.transactions.length
      }
      var blockNum = parseInt(data.result.number,16)
      var myDate = new Date();
      var timestamp = myDate.toLocaleString()
      let res = {
      'blockNum': blockNum,
      'txCount': txCount,
      'preHash': data.result.parentHash,
      'dataHash': data.result.transactionsRoot,
      'firstTxTimestamp': timestamp,
      'blockhash': data.result.hash,
      'genesis_block_hash': channelName,
      'txs': data.result.transactions
    }
      return res;
    } catch (err) {
      console.log(err)
    }
  }

  getJustBlockNumber () {
    try {     
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1},
      });

      let data = JSON.parse(result.getBody().toString())
      return data.result;
    } catch (err) {
      console.log(err)
    }
  }

  getJustNode () {
    try {     
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc":"2.0","method":"net_nodeInfo","params":[],"id":1},
      });

      let data = JSON.parse(result.getBody().toString())
      return data.result;
    } catch (err) {
      console.log(err)
    }
  }

  getJustchannels () {
    try {     
      var result = request('POST', this.baseurl, {
         json: {"jsonrpc":"2.0","method":"net_channelInfo","params":[],"id":1},
      });

      let data = JSON.parse(result.getBody().toString())
      return data.result;
    } catch (err) {
      console.log(err)
    }
  }


}

module.exports = PlatformJustitia
