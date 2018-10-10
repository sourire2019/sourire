/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import BlocksView from './View/BlocksView'
import NetworkView from './View/NetworkView'
import TransactionsView from './View/TransactionsView'
import ContractView from './View/ContractView'
import DashboardView from './View/DashboardView'
import ChannelsView from './View/ChannelsView'
import { chartSelectors } from '../state/redux/charts/'
import { tableOperations, tableSelectors } from '../state/redux/tables/'

const {
  currentChannelSelector,
  channelListSelector,
  dashStatsSelector,
  nodeStatusSelector,
  transactionByOrgSelector
} = chartSelectors

const {
  blockListSelector,
  contractListSelector,
  channelsSelector,
  nodeListSelector,
  transactionSelector,
  transactionListSelector
} = tableSelectors

const {
  transaction
} = tableOperations

export const Main = (props) => {
  const blocksViewProps = {
    blockList: props.blockList,
    currentChannel: props.currentChannel,
    getTransaction: props.getTransaction,
    transaction: props.transaction,
    appLocale: props.appLocale
  }
  const contractViewProps = {
    contractList: props.contractList,
    appLocale: props.appLocale
  }

  const channelsViewProps = {
    channels: props.channels,
    appLocale: props.appLocale
  }

  const dashboardViewProps = {
    blockList: props.blockList,
    dashStats: props.dashStats,
    nodeStatus: props.nodeStatus,
    transactionByOrg: props.transactionByOrg,
    appLocale: props.appLocale
  }
  const networkViewProps = {
    nodeList: props.nodeList,
    appLocale: props.appLocale
  }
  const transactionsViewProps = {
    currentChannel: props.currentChannel,
    transaction: props.transaction,
    transactionList: props.transactionList,
    getTransaction: props.getTransaction,
    appLocale: props.appLocale
  }
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' render={() => <DashboardView {...dashboardViewProps} />} />
          <Route path='/blocks' render={() => <BlocksView {...blocksViewProps} />} />
          <Route path='/contracts' render={() => <ContractView {...contractViewProps} />} />
          <Route path='/channels' render={() => <ChannelsView {...channelsViewProps} />} />
          <Route path='/network' render={() => <NetworkView {...networkViewProps} />} />
          <Route path='/transactions' render={() => <TransactionsView {...transactionsViewProps} />} />
        </Switch>
      </div>
    </Router>
  )
}

export default connect((state) => ({
  blockList: blockListSelector(state),
  contractList: contractListSelector(state),
  channelList: channelListSelector(state),
  channels: channelsSelector(state),
  currentChannel: currentChannelSelector(state),
  dashStats: dashStatsSelector(state),
  nodeList: nodeListSelector(state),
  nodeStatus: nodeStatusSelector(state),
  transaction: transactionSelector(state),
  transactionByOrg: transactionByOrgSelector(state),
  transactionList: transactionListSelector(state)
}), {
  getTransaction: transaction
})(Main)
