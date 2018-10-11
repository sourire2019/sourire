var requtil = require('./requestutils.js')
const dbroutes = (app, persist) => {
  var statusMetrics = persist.getMetricService()
  var crudService = persist.getCrudService()

  app.get('/api/status/:channel', function (req, res) {
    let channelName = req.params.channel
    if (channelName) {
      statusMetrics.getStatus(channelName, function (data) {
        if (
          data &&
          (data.contractCount &&
            data.txCount && data.nodeCount)
        ) {
          return res.send(data)
        } else {
          return requtil.notFound(req, res)
        }
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/block/transactions/:channel/:number', async function (req, res) {
    let number = parseInt(req.params.number)
    let channelName = req.params.channel
    if (!isNaN(number) && channelName) {
      var row = await crudService.getTxCountByBlockNum(channelName, number)
      if (row) {
        return res.send({
          status: 200,
          number: row.blockNum,
          txCount: row.txCount
        })
      }
      return res.send({
        status: 200,
        number: {},
        txCount: {}
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/transaction/:channel/:txid', function (req, res) {
    let txid = req.params.txid
    let channelName = req.params.channel
    if (txid && txid !== '0' && channelName) {
      crudService.getTransactionByID(channelName, txid).then(row => {
        if (row) {
          return res.send({ status: 200, row })
        } else {
          return res.send({
            status: 200,
            row: [ ]
          })
        }
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/txList/:channel/:blocknum/:txid', function (req, res) {
    let channelName = req.params.channel
    let blockNum = parseInt(req.params.blocknum)
    let txid = parseInt(req.params.txid)
    if (isNaN(txid)) {
      txid = 0
    }
    if (channelName) {
      crudService.getTxList(channelName, blockNum, txid).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        } else {
          return res.send({
            status: 200,
            rows: []
          })
        }
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/nodes/:channel', function (req, res) {
    let channelName = req.params.channel
    if (channelName) {
      statusMetrics.getNodeList(channelName, function (data) {
        res.send({ status: 200, nodes: data })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/blockAndTxList/:channel/:blocknum', function (req, res) {
    let channelName = req.params.channel
    let blockNum = parseInt(req.params.blocknum)
    if (channelName && !isNaN(blockNum)) {
      crudService.getBlockAndTxList(channelName, blockNum).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        } else {
          return res.send({
            status: 200,
            rows: {}
          })
        }
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/txByMinute/:channel/:hours', function (req, res) {
    let channelName = req.params.channel
    let hours = parseInt(req.params.hours)

    if (channelName && !isNaN(hours)) {
      statusMetrics.getTxByMinute(channelName, hours).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        }
        return res.send({
          status: 200,
          rows: {}
        })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/txByHour/:channel/:days', function (req, res) {
    let channelName = req.params.channel
    let days = parseInt(req.params.days)

    if (channelName && !isNaN(days)) {
      statusMetrics.getTxByHour(channelName, days).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        }
        return res.send({
          status: 200,
          rows: {}
        })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/blocksByMinute/:channel/:hours', function (req, res) {
    let channelName = req.params.channel
    let hours = parseInt(req.params.hours)

    if (channelName && !isNaN(hours)) {
      statusMetrics.getBlocksByMinute(channelName, hours).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        }
        return res.send({
          status: 200,
          rows: {}
        })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/blocksByHour/:channel/:days', function (req, res) {
    let channelName = req.params.channel
    let days = parseInt(req.params.days)

    if (channelName && !isNaN(days)) {
      statusMetrics.getBlocksByHour(channelName, days).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        }
        return res.send({
          status: 200,
          rows: {}
        })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/txByOrg/:channel', function (req, res) {
    let channelName = req.params.channel

    if (channelName) {
      statusMetrics.getTxByOrgs(channelName).then(rows => {
        if (rows) {
          return res.send({ status: 200, rows })
        }
        return res.send({
          status: 200,
          rows: {}
        })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/channels/info', function (req, res) {
    crudService.getChannelsInfo().then(data => {
      res.send({ status: 200, channels: data })
    }).catch(err => res.send({ status: 500 }))
  })

  app.get('/api/nodesStatus/:channel', function (req, res) {
    let channelName = req.params.channel
    if (channelName) {
      statusMetrics.getNodeList(channelName, function (data) {
        let nodes = []
        data.forEach(data => {
          let node = {
            'status': 'RUNNING',
            'server_hostname': data.requests
          }
          nodes.push(node)
        })
        res.send({ status: 200, nodes: nodes })
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })

  app.get('/api/contract/:channel', function (req, res) {
    let channelName = req.params.channel
    if (channelName) {
      crudService.getContract(channelName).then(rows => {
        if (rows) {
          res.send({
            status: 200,
            contract: rows
          })
        } else {
          res.send({
            status : 200,
            contract : {}
          })
        }
      })
    } else {
      return requtil.invalidRequest(req, res)
    }
  })
}

module.exports = dbroutes
