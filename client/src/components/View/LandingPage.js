/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react'
import Slider from 'react-slick'
import { connect } from 'react-redux'
import Logo from '../../static/images/logo.png'
import { chartOperations } from '../../state/redux/charts/'
import { tableOperations } from '../../state/redux/tables/'
import { chartSelectors } from '../../state/redux/charts/'

const {
  blockPerHour,
  blockPerMin,
  channel,
  channelList,
  dashStats,
  nodeStatus,
  transactionByOrg,
  transactionPerHour,
  transactionPerMin
} = chartOperations

const {
  blockList,
  contractList,
  channels,
  nodeList,
  transactionList
} = tableOperations

const { currentChannelSelector } = chartSelectors

export class LandingPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      settings: {
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        accessibility: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
      },
      logoStyle: {
        width: '520px',
        height: '100px'
      },
      hasDbError: false
    }
  }

  async componentDidMount () {
    await this.props.getChannel()
    const currentChannel = this.props.currentChannel

    let promiseTimeout = setTimeout(() => {
      this.setState({ hasDbError: true })
    }, 60000)

    await Promise.all([
      this.props.getBlockList(currentChannel),
      this.props.getBlocksPerMin(currentChannel),
      this.props.getBlocksPerHour(currentChannel),
      this.props.getContractList(currentChannel),
      this.props.getChannelList(currentChannel),
      this.props.getChannels(),
      this.props.getDashStats(currentChannel),
      this.props.getNodeList(currentChannel),
      this.props.getNodeStatus(currentChannel),
      this.props.getTransactionByOrg(currentChannel),
      this.props.getTransactionList(currentChannel),
      this.props.getTransactionPerHour(currentChannel),
      this.props.getTransactionPerMin(currentChannel)
    ])
    clearTimeout(promiseTimeout)
    this.props.updateLoadStatus()
  }

  render () {
    if (this.state.hasDbError) {
      return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Error: One or more components failed to render.</h1>
        </div>
      )
    }
    return (
      <div className='landingBackground'>
        <div className='landing' >
          <img src={Logo} style={this.state.logoStyle} alt='TrustChain Logo' />
          <Slider {...this.state.settings}>
            <div><h3>ACCESSING THE NETWORK</h3></div>
            <div><h3>CONNECTING TO CHANNEL</h3></div>
            <div><h3>LOADING BLOCKS</h3></div>
          </Slider>
        </div>
      </div>
    )
  }
}

export default connect((state) => ({
  currentChannel: currentChannelSelector(state)
}), {
  getBlockList: blockList,
  getBlocksPerHour: blockPerHour,
  getBlocksPerMin: blockPerMin,
  getContractList: contractList,
  getChannelList: channelList,
  getChannel: channel,
  getChannels: channels,
  getDashStats: dashStats,
  getNodeList: nodeList,
  getNodeStatus: nodeStatus,
  getTransactionByOrg: transactionByOrg,
  getTransactionList: transactionList,
  getTransactionPerHour: transactionPerHour,
  getTransactionPerMin: transactionPerMin
})(LandingPage)
