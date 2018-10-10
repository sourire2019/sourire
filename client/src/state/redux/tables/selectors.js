/**
 *    SPDX-License-Identifier: Apache-2.0
 */

export const blockListSelector = (state) => (state.tables.blockList.rows)
export const contractListSelector = (state) => (state.tables.contractList.rows)
export const channelsSelector = (state) => (state.tables.channels.rows)
export const nodeListSelector = (state) => (state.tables.nodeList.rows)
export const transactionSelector = (state) => (state.tables.transaction.transaction)
export const transactionListSelector = (state) => (state.tables.transactionList.rows)
