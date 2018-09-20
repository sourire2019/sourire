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

class Contracts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogOpen: false,
      sourceDialog: false,
      contract: {}
    };
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
    return [
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
      },
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
      },
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
      },
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
      },
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
    ];
  };

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
