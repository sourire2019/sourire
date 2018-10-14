/**
*    SPDX-License-Identifier: Apache-2.0
*/

var helper = require('../../helper.js')
var logger = helper.getLogger('metricservice')
var sql = require('./db/pgservice.js')

class MetricService {
  constructor () {

  }

  //= =========================query counts ==========================
  getContractCount (channelName) {
    return sql.getRowsBySQlCase(`select count(1) c from contracts where genesis_block_hash='${channelName}' `)
  }

  getNodelistCount (channelName) {
    return sql.getRowsBySQlCase(`select count(1) c from node where genesis_block_hash='${channelName}' `)
  }

  getTxCount (channelName) {
    return sql.getRowsBySQlCase(`select count(1) c from transactions where genesis_block_hash='${channelName}'`)
  }

  getBlockCount (channelName) {
    return sql.getRowsBySQlCase(`select count(1) c from blocks where genesis_block_hash='${channelName}'`)
  }

  getChannelCount (channelName) {
    return sql.getRowsBySQlCase(`select count(1) c from channel where genesis_block_hash='${channelName}' `)
  }

  getLastBlock (channelName) {
    let sqlLastBlock = ` select blocks.blocknum from blocks where blocks.genesis_block_hash ='${channelName}'order by id DESC limit 1`
    return sql.getRowByPkOne(sqlLastBlock)
  }
  async getNodeData (channelName) {
    let nodeArray = []
    var c1 = await sql.getRowsBySQlNoCondtion(`select channel.name as channelname,c.requests as requests,c.genesis_block_hash as genesis_block_hash ,c.server_hostname as server_hostname from node as c inner join  channel on c.genesis_block_hash=channel.genesis_block_hash where c.genesis_block_hash='${channelName}'`)
    for (var i = 0, len = c1.length; i < len; i++) {
      var item = c1[i]
      nodeArray.push({ 'name': item.channelname, 'requests': item.requests, 'server_hostname': item.server_hostname, 'genesis_block_hash': item.genesis_block_hash })
    }
    return nodeArray
  }
  // BE -303
  async getOrdererData () {
    let ordererArray = []
    var c1 = await sql.getRowsBySQlNoCondtion(`select c.requests as requests,c.server_hostname as server_hostname,c.genesis_block_hash as genesis_block_hash from orderer c`)
    for (var i = 0, len = c1.length; i < len; i++) {
      var item = c1[i]
      ordererArray.push({ 'requests': item.requests, 'server_hostname': item.server_hostname, 'genesis_block_hash': item.genesis_block_hash })
    }
    return ordererArray
  }
  // BE -303
  async getTxPerContractGenerate (channelName) {
    let txArray = []
    var c = await sql.getRowsBySQlNoCondtion(`select  c.name as contractname,channel.name as channelname ,c.version as version,c.genesis_block_hash as genesis_block_hash,c.path as path ,txcount  as c from contracts as c inner join channel on c.genesis_block_hash=channel.genesis_block_hash where  c.genesis_block_hash='${channelName}' `)
    // console.log("contract---" + c)
    if (c) {
      c.forEach((item, index) => {
        txArray.push({ 'channelName': item.channelname, 'contractname': item.contractname, 'path': item.path, 'version': item.version, 'txCount': item.c, 'genesis_block_hash': item.genesis_block_hash })
      })
    }
    return txArray
  }

  async getTxPerContract (channelName, cb) {
    try {
      var txArray = await this.getTxPercontractGenerate(channelName)
      cb(txArray)
    } catch (err) {
      logger.error(err)
      cb([])
    }
  }

  async getStatusGenerate (channelName) {
    var contractCount = await this.getContractCount(channelName)
    if (!contractCount) contractCount = 0
    var txCount = await this.getTxCount(channelName)
    if (!txCount) txCount = 0
    txCount.c = txCount.c ? txCount.c : 0
    var blockCount = await this.getBlockCount(channelName)
    if (!blockCount) blockCount = 0
    blockCount.c = blockCount.c ? blockCount.c : 0
    var nodeCount = await this.getNodelistCount(channelName)
    if (!nodeCount) nodeCount = 0
    nodeCount.c = nodeCount.c ? nodeCount.c : 0
    var channelCount = await this.getChannelCount(channelName)
    if (!channelCount) channelCount = 0
    channelCount.c = channelCount.c ? channelCount.c : 0
    return { 'contractCount': contractCount.c, 'txCount': txCount.c, 'latestBlock': blockCount.c, 'nodeCount': nodeCount.c, 'channelCount' : channelCount.c }
  }

  async getLastBlockNum (channelName, cb) {
    let res = await this.getLastBlock(channelName)
    cb(res)
  }

  async getStatus (channelName, cb) {
    try {
      var data = await this.getStatusGenerate(channelName)
      cb(data)
    } catch (err) {
      logger.error(err)
    }
  }

  async getNodeList (channelName, cb) {
    try {
      var nodeArray = await this.getNodeData(channelName)
      cb(nodeArray)
    } catch (err) {
      logger.error(err)
      cb([])
    }
  }
  // BE -303
  async getOrdererList (cb) {
    try {
      var ordererArray = await this.getOrdererData()
      cb(ordererArray)
    } catch (err) {
      logger.error(err)
      cb([])
    }
  }
  // BE -303
  // transaction metrics

  getTxByMinute (channelName, hours) {
    let sqlPerMinute = ` with minutes as (
            select generate_series(
              date_trunc('min', now()) - '${hours}hour'::interval,
              date_trunc('min', now()),
              '1 min'::interval
            ) as datetime
          )
          select
            minutes.datetime,
            count(createdt)
          from minutes
          left join TRANSACTIONS on date_trunc('min', TRANSACTIONS.createdt) = minutes.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerMinute)
  }

  getTxByHour (channelName, day) {
    let sqlPerHour = ` with hours as (
            select generate_series(
              date_trunc('hour', now()) - '${day}day'::interval,
              date_trunc('hour', now()),
              '1 hour'::interval
            ) as datetime
          )
          select
            hours.datetime,
            count(createdt)
          from hours
          left join TRANSACTIONS on date_trunc('hour', TRANSACTIONS.createdt) = hours.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerHour)
  }

  getTxByDay (channelName, days) {
    let sqlPerDay = ` with days as (
            select generate_series(
              date_trunc('day', now()) - '${days}day'::interval,
              date_trunc('day', now()),
              '1 day'::interval
            ) as datetime
          )
          select
            days.datetime,
            count(createdt)
          from days
          left join TRANSACTIONS on date_trunc('day', TRANSACTIONS.createdt) =days.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerDay)
  }

  getTxByWeek (channelName, weeks) {
    let sqlPerWeek = ` with weeks as (
            select generate_series(
              date_trunc('week', now()) - '${weeks}week'::interval,
              date_trunc('week', now()),
              '1 week'::interval
            ) as datetime
          )
          select
            weeks.datetime,
            count(createdt)
          from weeks
          left join TRANSACTIONS on date_trunc('week', TRANSACTIONS.createdt) =weeks.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerWeek)
  }

  getTxByMonth (channelName, months) {
    let sqlPerMonth = ` with months as (
            select generate_series(
              date_trunc('month', now()) - '${months}month'::interval,
              date_trunc('month', now()),
              '1 month'::interval
            ) as datetime
          )

          select
            months.datetime,
            count(createdt)
          from months
          left join TRANSACTIONS on date_trunc('month', TRANSACTIONS.createdt) =months.datetime  and channelname ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerMonth)
  }

  getTxByYear (channelName, years) {
    let sqlPerYear = ` with years as (
            select generate_series(
              date_trunc('year', now()) - '${years}year'::interval,
              date_trunc('year', now()),
              '1 year'::interval
            ) as year
          )
          select
            years.year,
            count(createdt)
          from years
          left join TRANSACTIONS on date_trunc('year', TRANSACTIONS.createdt) =years.year and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerYear)
  }

  // block metrics API

  getBlocksByMinute (channelName, hours) {
    let sqlPerMinute = ` with minutes as (
            select generate_series(
              date_trunc('min', now()) - '${hours} hour'::interval,
              date_trunc('min', now()),
              '1 min'::interval
            ) as datetime
          )
          select
            minutes.datetime,
            count(createdt)
          from minutes
          left join BLOCKS on date_trunc('min', BLOCKS.createdt) = minutes.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1  `

    return sql.getRowsBySQlQuery(sqlPerMinute)
  }

  getBlocksByHour (channelName, days) {
    let sqlPerHour = ` with hours as (
            select generate_series(
              date_trunc('hour', now()) - '${days}day' + '0.3days'::interval,
              date_trunc('hour', now()),
              '1 hour'::interval
            ) as datetime
          )
          select
            hours.datetime,
            count(createdt)
          from hours
          left join BLOCKS on date_trunc('hour', BLOCKS.createdt) = hours.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerHour)
  }

  getBlocksByDay (channelName, days) {
    let sqlPerDay = `  with days as (
            select generate_series(
              date_trunc('day', now()) - '${days}day'::interval,
              date_trunc('day', now()),
              '1 day'::interval
            ) as datetime
          )
          select
            days.datetime,
            count(createdt)
          from days
          left join BLOCKS on date_trunc('day', BLOCKS.createdt) =days.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerDay)
  }

  getBlocksByWeek (channelName, weeks) {
    let sqlPerWeek = ` with weeks as (
            select generate_series(
              date_trunc('week', now()) - '${weeks}week'::interval,
              date_trunc('week', now()),
              '1 week'::interval
            ) as datetime
          )
          select
            weeks.datetime,
            count(createdt)
          from weeks
          left join BLOCKS on date_trunc('week', BLOCKS.createdt) =weeks.datetime and genesis_block_hash ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerWeek)
  }

  getBlocksByMonth (channelName, months) {
    let sqlPerMonth = `  with months as (
            select generate_series(
              date_trunc('month', now()) - '${months}month'::interval,
              date_trunc('month', now()),
              '1 month'::interval
            ) as datetime
          )
          select
            months.datetime,
            count(createdt)
          from months
          left join BLOCKS on date_trunc('month', BLOCKS.createdt) =months.datetime and genesis_block_hash  ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerMonth)
  }

  getBlocksByYear (channelName, years) {
    let sqlPerYear = ` with years as (
            select generate_series(
              date_trunc('year', now()) - '${years}year'::interval,
              date_trunc('year', now()),
              '1 year'::interval
            ) as year
          )
          select
            years.year,
            count(createdt)
          from years
          left join BLOCKS on date_trunc('year', BLOCKS.createdt) =years.year and genesis_block_hash  ='${channelName}'
          group by 1
          order by 1 `

    return sql.getRowsBySQlQuery(sqlPerYear)
  }

  getTxByOrgs (channelName) {
    let sqlPerOrg = ` select count(creator_msp_id), creator_msp_id
      from transactions
      where genesis_block_hash ='${channelName}'
      group by  creator_msp_id`

    return sql.getRowsBySQlQuery(sqlPerOrg)
  }
}

module.exports = MetricService
