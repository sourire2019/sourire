/*
 Copyright ONECHAIN 2017 All Rights Reserved.

 */
var Metrics = require('./metrics')
var BlockListener = require('./BlockListener')
var SyncBlockData = require('./SynBlockData')

var blockPerMinMeter = Metrics.blockMetrics
var txnPerSecMeter = Metrics.txnPerSecMeter
var txnPerMinMeter = Metrics.txMetrics

async function start (platform, persistence, broadcaster) {
  var blockScanner, blockListener
  blockScanner = new SyncBlockData(platform, persistence, broadcaster)
  blockListener = new BlockListener(blockScanner)

  setInterval(function () {
    blockPerMinMeter.push(0)
    txnPerSecMeter.push(0)
    txnPerMinMeter.push(0)
  }, 500)

  // Sync Block
  blockListener.emit('syncChannels')
  blockListener.emit('syncContracts')
  blockListener.emit('syncNodelist')
  // ====================Orderer BE-303=====================================
  blockListener.emit('syncOrdererlist')
  // ====================Orderer BE-303=====================================
  blockListener.emit('syncBlock')
  blockListener.emit('syncChannelEventHubBlock')
}

exports.start = start
