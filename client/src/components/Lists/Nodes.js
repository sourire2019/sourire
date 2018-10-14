/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import matchSorter from 'match-sorter'
import { FormattedMessage } from 'react-intl'
import config from '../config.json'
import cn from '../../static/images/cn.svg'
import { Badge } from 'reactstrap'

const Nodes = ({ nodeList }) => {
  const columnHeaders = []
  for (let i = 0; i < config.network_table.length; i++) {
    switch (config.network_table[i]) {
      case 'nodename' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.nodename'
            defaultMessage='Node Name'
            description='Node Name'
          />,
          accessor: 'server_hostname',
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['server_hostname'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
      ); break
      case 'endpoint_url' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.endpoint'
            defaultMessage='ENDPOINT'
            description='ENDPOINT'
          />,
          accessor: 'requests',
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['requests'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
      );break
      case 'status' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.status'
            defaultMessage='status'
            description='status'
          />,
          accessor: 'requests',
          Cell: row => (<Badge color='success'>success</Badge>),
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['requests'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
        );break
        case 'location' : columnHeaders.push(
        {
          Header: <FormattedMessage
            id='page.localeProvider.location'
            defaultMessage='location'
            description='location'
          />,
          accessor: 'requests',
          Cell: row => (
            <span>Beijing<span style = {{color : "red"}}>•</span>
            China<img src = {cn} style = {{width : "30px"}} /></span>

            
          ),
          filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ['requests'] }, { threshold: matchSorter.rankings.SIMPLEMATCH }),
          filterAll: true
        }
      ); break
      default : break
    }
  }
  return (
    <div>
      <ReactTable
        data={nodeList}
        columns={columnHeaders}
        defaultPageSize={20}
        minRows={0}
        showPagination={!(nodeList.length < 5)}

      />
    </div>
  )
}

export default Nodes
