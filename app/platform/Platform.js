/**
 *    SPDX-License-Identifier: Apache-2.0
 */

var path = require('path')
var helper = require('../helper.js')
var logger = helper.getLogger('platformtender')
var fs = require('fs-extra')
var http = require('http')
var async = require('async')
var request = require('sync-request')
var url = require('url')

function getBlockByNumber (baseurl, channelName, blockNumber) {
  try {
    	let urlre = url.resolve(baseurl, '/block?height=' + blockNumber)
    let res = request('GET', urlre)
    let resultdata = JSON.parse(res.getBody().toString())
    return resultdata.result
  } catch (err) {
    throw (err)
  }
}

function getStatus (baseurl) {
  try {
    	let urlre = url.resolve(baseurl, '/status')
    let res = request('GET', urlre)
    let resultdata = res.getBody().toString()
    return resultdata
  } catch (err) {
    throw (err)
  }
}

function getnetInfo (baseurl, path) {
  try {
  	let urlre = url.resolve(baseurl, path)
    let res = request('GET', urlre)
    let resultdata = res.getBody().toString()
    return resultdata
  } catch (err) {
    throw (err)
  }
}

function getContract (channelName, cb) {
  try {
    let ContractArray = []
    cb(ContractArray)
  } catch (err) {
    logger.error(err)
    cb([])
    throw (err)
  }
}

function getChannels (baseurl, path) {
  let urlre = url.resolve(baseurl, path)
  let res = request('GET', urlre)
  let resultdata = res.getBody().toString()

  return resultdata
}

function getCurChannel (baseurl, path) {
  let urlre = url.resolve(baseurl, path)
  let res = request('GET', urlre)
  let resultdata = res.getBody().toString()
  return resultdata
}

module.exports = {
  getBlockByNumber,
  getStatus,
  getnetInfo,
  getContract,
  getChannels,
  getCurChannel
}
