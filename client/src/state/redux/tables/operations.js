/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import { get } from '../../../services/request.js'
import moment from 'moment-timezone'

const blockList = (channel) => (dispatch) => {
  return get(`/api/blockAndTxList/${channel}/0`)
    .then(resp => {
      dispatch(actions.getBlockList(resp))
    }).catch(error => {
      console.error(error)
    })
}

const contractList = (channel) => (dispatch) => {
  return get(`/api/contract/${channel}`)
    .then(resp => {
      dispatch(actions.getContractList(resp))
    }).catch(error => {
      console.error(error)
    })
}

// table channel
const channels = () => (dispatch) => {
  return get('/api/channels/info')
    .then(resp => {
      if (resp['channels']) {
        resp['channels'].forEach(element => {
          element.createdat = moment(element.createdat)
            .tz(moment.tz.guess())
            .format('M-D-YYYY h:mm A zz')
        })
      }

      dispatch(actions.getChannels(resp))
    }).catch(error => {
      console.error(error)
    })
}

const nodeList = (channel) => (dispatch) => {
  return get(`/api/nodes/${channel}`)
    .then(resp => {
      dispatch(actions.getNodeList(resp))
    }).catch(error => {
      console.error(error)
    })
}

const transaction = (channel, transactionId) => (dispatch) => {
  return get(`/api/transaction/${channel}/${transactionId}`)
    .then(resp => {
      dispatch(actions.getTransaction(resp))
    }).catch(error => {
      console.error(error)
    })
}

const transactionList = (channel) => (dispatch) => {
  return get(`/api/txList/${channel}/0/0/`)
    .then(resp => {
      resp.rows.forEach(element => {
        element.createdt = moment(element.createdt)
          .tz(moment.tz.guess())
          .format('M-D-YYYY h:mm A zz')
      })

      dispatch(actions.getTransactionList(resp))
    }).catch(error => {
      console.error(error)
    })
}

export default {
  blockList,
  contractList,
  channels,
  nodeList,
  transaction,
  transactionList
}
