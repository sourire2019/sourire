/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';
import {FormattedMessage} from 'react-intl';
import config from '../config.json'

class Channels extends Component {
  constructor(props) {
    super(props);
  }

  reactTableSetup = () => {
    const columnHeaders = [];
    for (let i = 0; i < config.chainsview.length; i++) {
        switch(config.chainsview[i]) {
            case "id" : columnHeaders.push(
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
              }
            ); break;
            case "chainname" : columnHeaders.push(
              {
                Header: <FormattedMessage
                            id="page.localeProvider.chainname"
                            defaultMessage='Chain Name'
                            description='Chain Name'
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
              }
            ); break;
            case "channelhash" : columnHeaders.push(
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
              }
            ); break;
            case "blocks" : columnHeaders.push(
              {
                Header: <FormattedMessage
                            id="page.localeProvider.blocks_l"
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
              }
            ); break;
            case "transactions" : columnHeaders.push(
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
              }
            ); break;
            case "timestamp" : columnHeaders.push(
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
              }
            ); break;
            default : break;

        }
    }
    return columnHeaders
  };

  render() {
    return (
      <div className="blockPage">
        <ReactTable
          data={this.props.channels}
          columns={this.reactTableSetup()}
          defaultPageSize={20}
          minRows={0}
          showPagination={this.props.channels.length < 5 ? false : true}
        />
      </div>
    );
  }
}

export default Channels;
