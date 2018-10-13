/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, {Component} from "react";
import Dialog from "material-ui/Dialog";
import TransactionView from "../View/TransactionView";
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from "match-sorter";
import {FormattedMessage} from 'react-intl';
import config from '../config.json'
class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dialogOpen: false
    };
  }

  handleDialogOpen = async tid => {
    await this.props.getTransaction(this.props.currentChannel, tid);
    this.setState({dialogOpen: true});
  };

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  handleEye = (row, val) => {
    const data = Object.assign({}, this.state.selection, {[row.index]: !val});
    this.setState({selection: data});
  };
  componentDidMount() {
    const selection = {};
    if (this.props.transactionList.length > 0) {
      this.props.transactionList.forEach(element => {
        selection[element.blocknum] = false;
      });      
    }

    this.setState({selection: selection});
  }

  render() {
    const columnHeaders = [];
    for (let i = 0; i < config.transactionsview.length; i++) {
      switch (config.transactionsview[i]) {
        case "creator": columnHeaders.push({
          Header:<FormattedMessage
                      id="page.localeProvider.creator"
                      defaultMessage="Creator"
                      description="Creator"
                      /> ,
          accessor: "creator_msp_id",
          filterMethod: (filter, rows) =>
            matchSorter(
              rows,
              filter.value,
              {keys: ["creator_msp_id"]},
              {threshold: matchSorter.rankings.SIMPLEMATCH}
            ),
          filterAll: true
        }); break; 
        case "chainname": columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.chainname"
                        defaultMessage="Chain Name"
                        description="Chain Name"
                        /> ,
            accessor: "channelname",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["channelname"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "txid" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.txid"
                        defaultMessage="Tx Id"
                        description="Tx Id"
                        /> ,
            accessor: "txhash",
            Cell: row => (
              <span>
                <a
                  className="partialHash"
                  onClick={() => this.handleDialogOpen(row.value)}
                  href="#/transactions"
                >
                  <div className="fullHash" id="showTransactionId">
                    {row.value}
                  </div>{" "}
                  {row.value.slice(0, 6)}
                  {!row.value ? "" : "... "}
                </a>
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
        ) ; break; 
        case "type" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.type"
                        defaultMessage="Type"
                        description="Type"
                        /> ,
            accessor: "type",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["type"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "contract" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.contract"
                        defaultMessage="Contract"
                        description="Contract"
                        /> ,
            accessor: "contractname",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["contractname"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "timestamp" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.timestamp"
                        defaultMessage="Timestamp"
                        description="Timestamp"
                        /> ,
            accessor: "createdt",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["createdt"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "txhash" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.txhash"
                        defaultMessage="Txhash"
                        description="Txhash"
                        /> ,
            accessor: "txhash",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["txhash"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "blockid" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.blockid"
                        defaultMessage="Blockid"
                        description="Blockid"
                        /> ,
            accessor: "blockid",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["blockid"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "blocktime" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.blocktime"
                        defaultMessage="Blocktime"
                        description="Blocktime"
                        /> ,
            accessor: "blocktime",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["blocktime"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "from" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.from"
                        defaultMessage="From"
                        description="From"
                        /> ,
            accessor: "from",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["from"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "to" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.to"
                        defaultMessage="To"
                        description="To"
                        /> ,
            accessor: "to",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["to"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        case "status" : columnHeaders.push(
          {
            Header:<FormattedMessage
                        id="page.localeProvider.status"
                        defaultMessage="Status"
                        description="Status"
                        /> ,
            accessor: "status",
            filterMethod: (filter, rows) =>
              matchSorter(
                rows,
                filter.value,
                {keys: ["status"]},
                {threshold: matchSorter.rankings.SIMPLEMATCH}
              ),
            filterAll: true
          }
        ); break; 
        default: break; 
      }
    }

    return (
      <div>
        <ReactTable
          data={this.props.transactionList.rows}
          columns={columnHeaders}
          defaultPageSize={10}
          minRows={0}
          showPagination={this.props.transactionList.length < 5 ? false : true}
        />

        <Dialog
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          fullWidth={true}
          maxWidth={"md"}
        >
          <TransactionView
            transaction={this.props.transaction}
            onClose={this.handleDialogClose}
          />
        </Dialog>
      </div>
    );
  }
}

export default Transactions;
