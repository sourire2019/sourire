/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, {Component} from "react";
import {withStyles} from "material-ui/styles";

import FontAwesome from "react-fontawesome";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Typography from "material-ui/Typography";

import moment from "moment-timezone";
import {
  Table,
  Card,
  CardBody,
  CardTitle} from "reactstrap";

import {FormattedMessage} from 'react-intl';

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 42,
    position: "relative"
  }
});
const reads = {
  color: "#2AA233"
};
const writes = {
  color: "#DD8016"
};

export class TransactionView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({loading: false});
  }
  componentWillMount() {
    const theme = sessionStorage.getItem("toggleTheme") === "true";
    this.setState({toggleClass: theme});
  }

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    if (this.props.transaction && !this.props.transaction.read_set) {
      return (
        <div className={this.state.toggleClass ? "dark-theme" : ""}>
          <div>
            <CardTitle className="dialogTitle">
              <FontAwesome name="list-alt" className="listIcon" />
                <FormattedMessage
                    id="page.localeProvider.txdetails"
                    defaultMessage="Transaction Details"
                    description="Transaction Details"
                    />:
              <button onClick={this.handleClose} className="closeBtn">
                <FontAwesome name="close" />
              </button>
            </CardTitle>
            <div align="center">
              <CardBody className="card-body">
                <span className="loading-wheel">
                  {" "}
                  <FontAwesome name="circle-o-notch" size="3x" spin />
                </span>
              </CardBody>
            </div>
          </div>
        </div>
      );
    } else if (this.props.transaction) {
      return (
        <div className={this.state.toggleClass ? "dark-theme" : ""}>
          <div className="dialog">
            <Card>
              <CardTitle className="dialogTitle">
                <FontAwesome name="list-alt" className="listIcon" />
                  <FormattedMessage
                    id="page.localeProvider.txdetails"
                    defaultMessage="Transaction Details"
                    description="Transaction Details"
                  />:
                
                <button onClick={this.handleClose} className="closeBtn">
                  <FontAwesome name="close" />
                </button>
              </CardTitle>
              <CardBody>
                <Table striped hover responsive className="table-striped">
                  <tbody>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.transactionid"
                          defaultMessage="Transaction ID"
                          description="Transaction ID"
                        />
                        :
                      </th>
                      <td>
                        {this.props.transaction.txhash}
                        <button className="copyBtn">
                          <div className="copyMessage">Copy</div>
                          <div className="copiedMessage">Copied</div>
                          <CopyToClipboard text={this.props.transaction.txhash}>
                            <FontAwesome name="copy" />
                          </CopyToClipboard>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.valcode"
                          defaultMessage="Validation Code"
                          description="Validation Code"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.validation_code}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.payprohash"
                          defaultMessage="Payload Proposal Hash"
                          description="Payload Proposal Hash"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.payload_proposal_hash}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.creatormsp"
                          defaultMessage="Creator MSP"
                          description="Creator MSP"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.creator_msp_id}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.endoser"
                          defaultMessage="Endoser"
                          description="Endoser"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.endorser_msp_id}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.contractname"
                          defaultMessage="Contract Name"
                          description="Contract Name"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.contractname}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.type"
                          defaultMessage="Type"
                          description="Type"
                        />
                        :
                      </th>
                      <td>{this.props.transaction.type}</td>
                    </tr>
                    <tr>
                      <th>
                        <FormattedMessage
                          id="page.localeProvider.time"
                          defaultMessage="Time"
                          description="Time"
                        />
                        :
                      </th>
                      <td>
                        {moment(this.props.transaction.createdt)
                          .tz(moment.tz.guess())
                          .format("M-D-YYYY h:mm A zz")}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </div>
      );
    }
    return (
      <div className={this.state.toggleClass ? "dark-theme" : ""}>
        <CardTitle className="dialogTitle">
          <FontAwesome name="list-alt" className="listIcon" />Transaction
          Details
          <button onClick={this.handleClose} className="closeBtn">
            <FontAwesome name="close" />
          </button>
        </CardTitle>
        <div align="center">
          <CardBody className="card-body">
            <span className="loading-wheel">
              {" "}
              <FontAwesome name="circle-o-notch" size="3x" spin />
            </span>
          </CardBody>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TransactionView);
