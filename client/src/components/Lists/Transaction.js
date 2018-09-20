/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import TransactionView from "../View/TransactionView";
import BlockView from "../View/BlockView";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import FontAwesome from "react-fontawesome";
import find from "lodash/find";
import {FormattedMessage} from 'react-intl';

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      loading: false,
      dialogOpenBlockHash: false,
      blockHash: {},
      transactions :{}
    };
  }

  handleDialogOpen = async tid => {
    await this.props.gettransaction(this.props.currentChannel, tid);
    this.setState({dialogOpen: true});
  };

  handleDialogOpenTransactions = transactions =>{
    const data = transactions;
    this.setState({dialogOpen: true,transactions : transactions});
  }

  handleDialogClose = () => {
    //this.props.removeTransactionInfo();
    this.setState({dialogOpen: false});
  };

  handleDialogOpenBlockHash = blockHash => {
    const data = find(this.props.blockList, item => {
      return item.blockhash === blockHash;
    });

    this.setState({
      dialogOpenBlockHash: true,
      blockHash: data
    });
  };


  handleDialogCloseBlockHash = () => {
    this.setState({dialogOpenBlockHash: false});
  };

  handleEye = (row, val) => {
    const data = Object.assign({}, this.state.selection, {[row.index]: !val});
    this.setState({selection: data});
  };

  componentDidMount() {
    const selection = {};
    this.props.transaction.forEach(element => {
      selection[element.blocknum] = false;
    });
    this.setState({selection: selection});
  }

  reactTableSetup = () => {
    return [

      {
        Header: <FormattedMessage
                    id="page.localeProvider.transactions"
                    defaultMessage="Transactions"
                    description="Transactions"
                    />,
        accessor: "txhash",
        Cell: row => (
          <span>
            <a
              className="partialHash"
              onClick={() => this.handleDialogOpen(row.value)}
              href="#/blocks"
            >
              <div className="fullHash" id="showTransactionId">
                {row.value}
              </div>{" "}
              {row.value}
            </a>{" "}
          </span>
         
        ),
        filterMethod: (filter, rows) =>
          matchSorter(
            rows,
            filter.value,
            {keys: ["txhash"]},
            {threshold: matchSorter.rankings.SIMPLEMATCH}
          ),
        filterAll: true
      }
    ];
  };

  render() {
    return (
      <div>
        <ReactTable
          data={this.props.transaction}
          columns={this.reactTableSetup()}
          defaultPageSize={10}
          className="-striped -highlight"
          filterable
          minRows={0}
        />

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          fullWidth={true}
          maxWidth={"md"}
        >
          <TransactionView
            transaction={this.props.transactions}
            onClose={this.handleDialogClose}
          />
        </Dialog>

      </div>
    );
  }
}

export default Transaction;
