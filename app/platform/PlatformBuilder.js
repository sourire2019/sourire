/*
*SPDX-License-Identifier: Apache-2.0
*/

var PlatformTender = require('./tendermint/PlatformTender.js')
var PlatformBurrow = require('./burrow/PlatformBurrow.js')
var PlatformJustitia = require('./justitia/PlatformJustitia.js')

class PlatformBuilder {
  static async build (pltfrm) {
    if (pltfrm === 'tendermint') {
      var platform = new PlatformTender()
      return platform
    } else if (pltfrm === 'burrow') {
      	platform = new PlatformBurrow()
      return platform
    } else if (pltfrm === 'justitia') {
        platform = new PlatformJustitia()
      return platform
    }
    throw ('Invalid Platform')
  }
}

module.exports = PlatformBuilder
