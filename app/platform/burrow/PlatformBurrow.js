/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var helper = require('../../helper.js')
var logger = helper.getLogger('platformtender')
var config = require('./config.json')
var request = require('sync-request')
var url = require('url')
var Platform = require('../Platform')

class PlatformBurrow {
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

  getBlockByNumber (channelName, blockNumber) {
  	let block = Platform.getBlockByNumber(this.baseurl, channelName, blockNumber)
    let result = {
      'blockNum': block.BlockMeta.header.height,
      'txCount': block.BlockMeta.header.num_txs,
      'preHash': block.Block.header.last_block_id.hash,
      'dataHash': block.BlockMeta.header.data_hash,
      'firstTxTimestamp': block.BlockMeta.header.time,
      'blockhash': block.BlockMeta.block_id.hash,
      'genesis_block_hash': block.BlockMeta.header.chain_id,
      'txs': block.Block.data.txs,
      'total_txs': block.BlockMeta.header.total_txs
    }

    return result
  }

  getChannels (res) {
    let resultdata = Platform.getChannels(this.baseurl, '/chain_id')
    let channels = []

    let result = JSON.parse(resultdata)
    channels.push({ 'channel_id': result.result.ChainId })
    let response = {
      status: 200 }
    response['channels'] = [...new Set(channels)]
    res.send(response)
  }

  getCurChannel (res) {
    let resultdata = JSON.parse(Platform.getCurChannel(this.baseurl, '/chain_id'))
    res.send({ 'currentChannel': resultdata.result.ChainId })
  }

  getStatus () {
  	let statusdata = JSON.parse(Platform.getStatus(this.baseurl))
    let result = {
      'listenaddr': statusdata.result.NodeInfo.ListenAddress,
      'network': statusdata.result.NodeInfo.Network,
      'latestblockheight': statusdata.result.SyncInfo.LatestBlockHeight

    }
    return result
  }

  getnetInfo () {
    let path = '/network'
    let netinfo = []
    let result = JSON.parse(Platform.getnetInfo(this.baseurl, path))
    let netnodes = result.result.peers
    if (netnodes) {
      for (let i = 0; i < netnodes.length; i++) {
        netinfo.push({
          'listenaddr': netnodes[i].NodeInfo.ListenAddress,
          'network': netnodes[i].NodeInfo.Network
        })
      }
    }
    return netinfo
  }

  getContract (channelName, cb) {
    Platform.getContract(channelName, cb)
  }

  getNodesStatus (channelName, cb) {
    try {
      	let nodes = []
      	let statusdata = this.getStatus()
      	let netinfo = this.getnetInfo()
      	if (statusdata) {
      		nodes.push({ 'status': 'RUNNING', 'server_hostname': statusdata.listenaddr })
      	}
      	if (netinfo) {
      		for (let i = 0; i < netinfo.length; i++) {
      			nodes.push({ 'status': 'RUNNING', 'server_hostname': netinfo[i].listenaddr })
      		}
      	}
      cb(nodes)
    } catch (err) {
      console.log(err)
      logger.error(err)
      cb([])
    }
  }

  getLastHeight () {
    try {
      let urlre = url.resolve(this.baseurl, '/blocks')
      let res = request('GET', urlre)
      let resultdata = JSON.parse(res.getBody().toString())
      let result = {
        'lastheight': resultdata.result.LastHeight,
        'chainid': resultdata.result.BlockMetas[0].header.chain_id
      }
      return result
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = PlatformBurrow
