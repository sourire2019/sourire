/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react'
import { Badge } from 'reactstrap'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import { FormattedMessage } from 'react-intl'
import config from '../config.json'

class NodesHealth extends Component {
  constructor (props) {
    super(props)
    this.state = { nodeStatus: props.nodeStatus }
  }

  render () {
    const columnHeaders = []
    for (let i = 0; i < config.nodeshealth.length; i++) {
      switch (config.nodeshealth[i]) {
        case 'nodename' : columnHeaders.push(
          {
            Header: <FormattedMessage
              id='page.localeProvider.nodename'
              defaultMessage='Node Name'
              description='Node Name'
            />,
            accessor: 'server_hostname',
            filterAll: false,
            className: 'center-column'
          }
        ); break
        case 'status' : columnHeaders.push(
          {
            Header: <FormattedMessage
              id='page.localeProvider.status'
              defaultMessage='Status'
              description='Status'
            />,
            accessor: 'status',
            filterAll: false,
            className: 'center-column',
            Cell: row => <Badge color='success'>{row.value}</Badge>
          }
        ); break
        default : break
      }
    }
    return (
      <div>
        <ReactTable
          data={this.props.nodeStatus}
          columns={columnHeaders}
          className='-striped -highlight nodes-health'
          minRows={0}
          showPagination={false}
        />
      </div>
    )
  }
}

export default NodesHealth
