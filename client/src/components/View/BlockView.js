/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {FormattedMessage} from 'react-intl';
import {
  Table,
  Card,
  CardBody,
  CardTitle } from "reactstrap";

import config from '../config.json'

const blockIcon = {
  color: "#79c879",
  margin: "20px"
};

class BlockView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: false });
  }
  componentWillMount() {
    const theme = sessionStorage.getItem("toggleTheme") === "true";
    this.setState({ toggleClass: theme });
  }
  handleClose = () => {
    this.props.onClose();
  };

  render() {
    const { blockHash } = this.props;
    const blockview = [];
    for (let i = 0; i < config.blockdetails.length; i++) {
      switch(config.blockdetails[i]) {
        case "channelname" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.channelname"
                defaultMessage="Channel name"
                description="Channel name"
              />
            </th>
            <td>{blockHash.channelname}</td>
          </tr>
        );break;
        case "id" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.id"
                defaultMessage="ID"
                description="ID"
              />
            </th>
            <td>{blockHash.id}</td>
          </tr>
          
        );break;
        case "blocknumber" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.blocknum"
                defaultMessage="Block Number"
                description="Block Number"
              />
            </th>
            <td>{blockHash.blocknum}</td>
          </tr>
        );break;
        case "createat" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.create"
                defaultMessage="Created at"
                description="Created at"
              />
            
            </th>
            <td>{blockHash.createdt}</td>
          </tr>
        );break;
        case "number_of_transactions" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.txnum"
                defaultMessage=" Number of Transactions"
                description=" Number of Transactions"
              />
           
            </th>
            <td>{blockHash.txcount}</td>
          </tr>
        );break;
        case "blockhash" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.blockhash"
                defaultMessage="Block Hash"
                description="Block Hash"
              />
            
            </th>
            <td>
              {blockHash.blockhash}
              <button className="copyBtn">
              <div className="copyMessage">Copy</div>
                <CopyToClipboard text={blockHash.blockhash}>
                  <FontAwesome name="copy" />
                </CopyToClipboard>
              </button>
            </td>
          </tr>
        );break;
        case "datahash" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.datahash"
                defaultMessage="Data Hash"
                description="Data Hash"
              />
            
            </th>
            <td>
              {blockHash.datahash}
              <button className="copyBtn">
              <div className="copyMessage">Copy</div>
                <CopyToClipboard text={blockHash.datahash}>
                  <FontAwesome name="copy" />
                </CopyToClipboard>
              </button>
            </td>
          </tr>
        );break;
        case "prehash" : blockview.push(
          <tr>
            <th>
              <FormattedMessage
                id="page.localeProvider.prehash"
                defaultMessage="Prehash"
                description="Prehash"
              />
            
            </th>
            <td>
              {blockHash.prehash}
              <button className="copyBtn">
              <div className="copyMessage">Copy</div>
                <CopyToClipboard text={blockHash.prehash}>
                  <FontAwesome name="copy" />
                </CopyToClipboard>
              </button>
            </td>
          </tr>
        );break;
        default: blockview.push(null); break;

      }
    }
    if (!blockHash) {
      return (
        <div className={this.state.toggleClass ? "dark-theme" : ""}>
          <Card>
            <CardTitle className="dialogTitle">
              <FontAwesome name="cube" />
              Block Details
              
            </CardTitle>
            <CardBody>
              <span className="loading-wheel">
                {" "}
                <FontAwesome name="circle-o-notch" size="3x" spin />
              </span>
            </CardBody>
          </Card>
        </div>
      );
    } else {
      return (
        <div className={this.state.toggleClass ? "dark-theme" : ""}>
          <div className="dialog">
            <Card>
              <CardTitle className="dialogTitle">
                <FontAwesome name="cube" className="cubeIcon" />
                  <FormattedMessage
                    id="page.localeProvider.datah"
                    defaultMessage="Block Details"
                    description="Block Details"
                  />
                <button onClick={this.handleClose} className="closeBtn">
                  <FontAwesome name="close" />
                </button>
              </CardTitle>
              <CardBody>
                <Table striped hover responsive className="table-striped">
                  <tbody>
                    {blockview}  
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </div>
      );
    }
  }
}

export default BlockView;
