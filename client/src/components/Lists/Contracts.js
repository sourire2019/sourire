/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';
import Dialog from 'material-ui/Dialog';
import ContractModal from '../View/ContractModal';
import { Button } from "reactstrap";
import {FormattedMessage} from 'react-intl';
import config from '../config.json';

class Contracts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogOpen: false,
      sourceDialog: false,
      contract: {}
    };
    console.log(456,props);
  }

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  sourceDialogOpen = contract => {
    this.setState({ contract: contract });
    this.setState({ sourceDialog: true });
  };

  sourceDialogClose = () => {
    this.setState({ sourceDialog: false });
  };

  reactTableSetup = () => {
    const columnHeaders = [];
    for (let i = 0; i < config.contractview.length; i++) {
        switch(config.contractview[i]) {
            case "contractname" : columnHeaders.push(
              {
                Header: <FormattedMessage
                            id="page.localeProvider.contractname"
                            defaultMessage='Contract Name'
                            description='Contract Name'
                            />,
                accessor: 'contractname',
                Cell: row => (
                  <a className="hash-hide" onClick={() => this.sourceDialogOpen(row.original)} href="#/contracts" >{row.value}</a>
                ),
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['contractname'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "channelname" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.channelname"
                            defaultMessage='Channel Name'
                            description='Channel Name'
                            /> ,
                accessor: 'channelName',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['channelName'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "path" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.path"
                            defaultMessage='Path'
                            description='Path'
                            /> ,
                accessor: 'path',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['path'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "transactions_count" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.txcount"
                            defaultMessage='Transaction Count'
                            description='Transaction Count'
                            /> ,
                accessor: 'txCount',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['txCount'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "version" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.version"
                            defaultMessage='Version'
                            description='Version'
                            /> ,
                accessor: 'version',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['version'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "name" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.name"
                            defaultMessage='name'
                            description='name'
                            /> ,
                accessor: 'name',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['name'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "balance" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.balance"
                            defaultMessage='balance'
                            description='balance'
                            /> ,
                accessor: 'balance',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['balance'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "txcount" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.txcount"
                            defaultMessage='txcount'
                            description='txcount'
                            /> ,
                accessor: 'txcount',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['txcount'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "creator" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.creator"
                            defaultMessage='creator'
                            description='creator'
                            /> ,
                accessor: 'creator',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['creator'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "creator_hash" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.creator_hash"
                            defaultMessage='Creator Hash'
                            description='Creator Hash'
                            /> ,
                accessor: 'creator_hash',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['creator_hash'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            case "contract_code" : columnHeaders.push(
              {
                Header:<FormattedMessage
                            id="page.localeProvider.contract_code"
                            defaultMessage='Contract Code'
                            description='Contract Code'
                            /> ,
                accessor: 'contract_code',
                filterMethod: (filter, rows) =>
                  matchSorter(
                    rows,
                    filter.value,
                    { keys: ['contract_code'] },
                    { threshold: matchSorter.rankings.SIMPLEMATCH }
                  ),
                filterAll: true
              }
            ); break;
            default : columnHeaders.push(null); break;

        }
    }
    return columnHeaders;
  }
  
  render() {
    return (
      <div > 
        <ReactTable
          data={this.props.contractList}
          columns={this.reactTableSetup()}
          defaultPageSize={5}
          className="-striped -highlight"
          filterable
          minRows={0}
          showPagination={ this.props.contractList.length < 5  ?  false : true }
        />
        <Dialog
          open={this.state.sourceDialog}
          onClose={this.sourceDialogClose}
          fullWidth={true}
          maxWidth={"md"}
        >
          <ContractModal contract={this.state.contract} />
        </Dialog>
      </div >
    );
  }
}

export default Contracts;
