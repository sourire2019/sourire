/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';
import {FormattedMessage} from 'react-intl';

class Channels extends Component {
  constructor(props) {
    super(props);
  }

  reactTableSetup = () => {
    return [
      {
        Header: <FormattedMessage
                    id="page.localeProvider.id"
                    defaultMessage='ID'
                    description='ID'
                    />,
        accessor: 'id',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['id'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true,
        width: 100
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.channelname"
                    defaultMessage='Channel Name'
                    description='Channel Name'
                    />,
        accessor: 'channelname',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['channelname'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.channelhash"
                    defaultMessage='Channel Hash'
                    description='Channel Hash'
                    />,
        accessor: 'channel_hash',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['channel_hash'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.blocks"
                    defaultMessage='Blocks'
                    description='Blocks'
                    />,
        accessor: 'blocks',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['blocks'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true,
        width: 125
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.transactionsl"
                    defaultMessage='Transactions'
                    description='Transactions'
                    />,
        accessor: 'transactions',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['transactions'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true,
        width: 125
      },
      {
        Header: <FormattedMessage
                    id="page.localeProvider.timestamp"
                    defaultMessage='Timestamp'
                    description='Timestamp'
                    />,
        accessor: 'createdat',
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            { keys: ['createdat'] },
            { threshold: matchSorter.rankings.SIMPLEMATCH }
          ),
        filterAll: true
      },
    ];
  };

  render() {
    return (
      <div className="blockPage">
        <ReactTable
          data={this.props.channels}
          columns={this.reactTableSetup()}
          defaultPageSize={5}
          className="-striped -highlight"
          filterable
          minRows={0}
          showPagination={this.props.channels.length < 5 ? false : true}
        />
      </div>
    );
  }
}

export default Channels;
