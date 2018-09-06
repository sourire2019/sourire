/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import actions from './actions'
import { get } from '../../../services/request.js';
import moment from "moment-timezone";

const blockList = (channel) => (dispatch) => {
 return get(`/api/blockAndTxList/${channel}/0`)
    .then( resp => {
      dispatch(actions.getBlockList(resp))
    }).catch( error => {
      console.error(error)
    })
}

const chaincodeList = (channel) => (dispatch) => {
 return get(`/api/chaincode/${channel}`)
    .then( resp => {
      dispatch(actions.getChaincodeList(resp))
    }).catch( error => {
      console.error(error)
    })
}

//table channel
const channels = () => (dispatch) => {
  return get('/api/channels/info')
    .then(resp => {
      resp['channels'].forEach(element => {
        element.createdat = moment(element.createdat)
          .tz(moment.tz.guess())
          .format("M-D-YYYY h:mm A zz");
      })

      dispatch(actions.getChannels(resp))
    }).catch( error => {
      console.error(error)
    })
}

const peerList = (channel) => (dispatch) => {
 return get(`/api/peers/${channel}`)
    .then(resp => {
      dispatch(actions.getPeerList(resp))
    }).catch( error => {
      console.error(error)
    })
}

const transaction = (channel, transactionId) => (dispatch) => {
  return get(`/api/transaction/${channel}/${transactionId}`)
    .then(resp => {
      let resp1 = {
        "status": 200,
        "row": {
        "txhash": "5018a79af996a441731b85e5853921d8ddf45978ec932a6fdef0c9e7b6b685a9",
        "validation_code": "VALID",
        "payload_proposal_hash": "a4f4dfa04ca3805cd758a9b3ebe1fb5ef6d6ca65f4b6d6201bae48c510536d60",
        "creator_msp_id": "Org2MSP",
        "endorser_msp_id": "{\"Org2MSP\"}",
        "chaincodename": "lscc",
        "type": "ENDORSER_TRANSACTION",
        "createdt": "2018-08-27T04:01:06.000Z",
        "read_set": [
          {
            "chaincode": "lscc",
            "set": [
              {
              "key": "mycc",
              "version": null
              }
            ]
          },
          {
            "chaincode": "mycc",
            "set": []
          }
        ],
        "write_set": [
          {
            "chaincode": "mycc",
            "set": [
              {
                "key": "a",
                "is_delete": false,
                "value": "100"
              },
              {
                "key": "b",
                "is_delete": false,
                "value": "200"
              }
            ] 
          }
        ],
        "channelname": "mychannel"
      } 
    };

      dispatch(actions.getTransaction(resp))
    }).catch( error => {
      console.error(error)
    })
}

const transactionList = (channel) => (dispatch) => {
  return get(`/api/txList/${channel}/0/0/`)
    .then(resp => {
      resp.rows.forEach(element => {
        element.createdt = moment(element.createdt)
          .tz(moment.tz.guess())
          .format("M-D-YYYY h:mm A zz");
      })

      dispatch(actions.getTransactionList(resp))
    }).catch( error => {
      console.error(error)
    })
}

export default {
  blockList,
  chaincodeList,
  channels,
  peerList,
  transaction,
  transactionList
}
