/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import types from './types'

const getBlockList = (blockList) => ({
  type: types.BLOCK_LIST,
  payload: blockList
})

const getContractList = (contractList) => ({
  type: types.CONTRACT_LIST,
  payload: contractList
})

const getChannels = (channels) => ({
  type: types.CHANNELS,
  payload: channels
})

const getNodeList = (nodeList) => ({
  type: types.NODE_LIST,
  payload: nodeList
})

const getTransaction = (transaction) => ({
  type: types.TRANSACTION,
  payload: transaction
})

const getTransactionList = (transactionList) => ({
  type: types.TRANSACTION_LIST,
  payload: transactionList
})

export default {
  getBlockList,
  getContractList,
  getChannels,
  getNodeList,
  getTransaction,
  getTransactionList
}
