/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {FormattedMessage} from 'react-intl';

class NodesHealth extends Component {
  constructor(props) {
    super(props);
    this.state = { nodeStatus: props.nodeStatus };
  }



  render() {

    const columnHeaders = [
      {
        Header: <FormattedMessage
                    id="page.localeProvider.nodename"
                    defaultMessage="Node Name"
                    description="Node Name"
                    />,
        accessor: 'server_hostname',
        filterAll: false,
        className: 'center-column',
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.status"
                    defaultMessage="Status"
                    description="Status"
                    />,
        accessor: 'status',
        filterAll: false,
        className: 'center-column',
        Cell: row => <Badge color="success">{row.value}</Badge>
      }
    ];

    return (
      <div>
        <ReactTable
          data={this.props.nodeStatus}
          columns={columnHeaders}
          className="-striped -highlight nodes-health"
          minRows={0}
          showPagination={false}
        />
      </div>
    );
  }
}

export default NodesHealth
