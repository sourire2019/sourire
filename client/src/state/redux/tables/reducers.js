/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { combineReducers } from 'redux'
import types from './types'

const initialState = {}

const blockListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.BLOCK_LIST: {
      return ({
        rows: action.payload.rows,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const contractListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CONTRACT_LIST: {
      return ({
        rows: action.payload.contract,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const channelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANNELS: {
      return ({
        rows: action.payload.channels,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const nodeListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.NODE_LIST: {
      return ({
        rows: action.payload.nodes,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TRANSACTION: {
      return ({
        transaction: action.payload.row,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const transactionListReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TRANSACTION_LIST: {
      return ({
        rows: action.payload,
        loaded: true,
        errors: action.error
      })
    }
    default: {
      return state
    }
  }
}

const reducer = combineReducers({
  blockList: blockListReducer,
  contractList: contractListReducer,
  channels: channelsReducer,
  nodeList: nodeListReducer,
  transaction: transactionReducer,
  transactionList: transactionListReducer
})

export default reducer
