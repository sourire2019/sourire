/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import ChartStats from '../Charts/ChartStats';
import NodesHealth from '../Lists/NodesHealth';
import TimelineStream from '../Lists/TimelineStream';
import {
  Row,
  Col
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Card from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { IntlProvider, addLocaleData } from 'react-intl';
import {FormattedMessage} from 'react-intl';
import config from '../config.json'

export class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      hasDbError: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setNotifications(this.props.blockList);
  }

  componentWillMount() {
    if (this.props.blockList == undefined || this.props.dashStats == undefined || this.props.nodeStatus == undefined || this.props.transactionByOrg == undefined) {
      this.setState({ hasDbError: true });
    }
  }

  componentDidMount() {
    this.setNotifications(this.props.blockList);
  }

  setNotifications = blockList => {
    let notificationsArr = [];
    if (blockList !== undefined) {
      for (
        let i = 0;
        i < 6 && blockList && blockList[i];
        i++
      ) {
        const block = blockList[i];
        const notify = {
          title: `Block ${block.blocknum} `,
          type: "block",
          time: block.createdt,
          txcount: block.txcount,
          datahash: block.datahash,
          blockhash: block.blockhash
        };
        notificationsArr.push(notify);
      }
    }
    this.setState({ notifications: notificationsArr });
  };

  render() {
    let status = [], dashboardview = [], nodeshealth = [], chartstatus = [], timelinestream = [];
    for (let i = 0; i < config.status.length; i++) {

      switch(config.status[i]) {
        case "blocks" : status.push(
          <div className="statistic vdivide" style={{ width: (100/config.status.length) +'%' }}>
            <Row>
              <Col sm= {(12/config.status.length)}>
                <Avatar className="stat-avatar avatar-block" >
                  <FontAwesome name="cube" />
                </Avatar>
              </Col>
              <Col sm= {(12/config.status.length)}>
                <h1 className="stat-count">{this.props.dashStats.latestBlock}</h1>
              </Col>
            </Row>
             <FormattedMessage
              id="page.localeProvider.blocks"
              defaultMessage="BLOCKS"
              description="BLOCKS"
              />
            
          </div>
        ); break;
        case "transactions" : status.push(
          <div className="statistic vdivide" style={{ width: (100/config.status.length) +'%' }}>
            <Row>
              <Col sm= {(12/config.status.length)}>
                <Avatar className="stat-avatar avatar-tx" >
                  <FontAwesome name="list-alt" />
                </Avatar>
              </Col>
              <Col sm= {(12/config.status.length)}>
                <h1 className="stat-count">{this.props.dashStats.txCount}</h1>
              </Col>
            </Row>
              <FormattedMessage
              id="page.localeProvider.transactions"
              defaultMessage="TRANSACTIONS"
              description="TRANSACTIONS"
              />
            
         </div>
        ); break;
        case "nodes" : status.push(<div className="statistic vdivide" style={{ width: (100/config.status.length) +'%' }}>
                  <Row>
                    <Col sm= {(12/config.status.length)}>
                      <Avatar className="stat-avatar avatar-node" >
                        <FontAwesome name="users" />
                      </Avatar>
                    </Col>
                    <Col sm= {(12/config.status.length)}>
                      <h1 className="stat-count">{this.props.dashStats.nodeCount}</h1>
                    </Col>
                  </Row>
                  <FormattedMessage
                    id="page.localeProvider.nodes"
                    defaultMessage="NODES"
                    description="NODES"
                    />
                  
                </div>); break;
        case "contracts" : status.push(<div className="statistic vdivide" style={{ width: (100/config.status.length) +'%' }}>
                  <Row>
                    <Col sm= {(12/config.status.length)}>
                      <Avatar className="stat-avatar avatar-contract" >
                        <FontAwesome name="handshake-o" />
                      </Avatar>
                    </Col>
                    <Col sm= {(12/config.status.length)}>
                      <h1 className="stat-count">{this.props.dashStats.contractCount}</h1>
                    </Col>
                  </Row>
                  <FormattedMessage
                    id="page.localeProvider.contracts"
                    defaultMessage="CONTRACTS"
                    description="CONTRACTS"
                    />
                  
                </div>); break;
        default: status.push(null); break;
      }
    }

    for (let i = 0; i < config.dashboardview.length; i++) {
      switch(config.dashboardview[i]) {
        case "status" : dashboardview.push(
          <Row>
            <Col sm="12">
              <Card className="stats-block ">
                {status}
              </Card>
            </Col>
          </Row>
        ); break;
        case "nodeshealth" : nodeshealth.push(
          <Col sm= {(12/config.dashboardview_middle_num)} >
            <Card className="dash-section">
              <NodesHealth
                nodeStatus={this.props.nodeStatus}
              />
            </Card>
            
          </Col>
        ); break;
        case "chartstatus" : chartstatus.push(
          <Col sm= {(12/config.dashboardview_middle_num)}>
            <Card className="dash-section">
              <ChartStats appLocale= {this.props.appLocale} />
            </Card>
          </Col>
        ); break;
        case "timelinestream" : timelinestream.push(
          <Row>
            <Col sm="12">
              <Card className="dash-section">
                <TimelineStream notifications={this.state.notifications} blockList={this.props.blockList} appLocale = {this.props.appLocale}/>
              </Card>
            </Col>
          </Row>
        ); break;
        default: dashboardview.push(null); break;
      }

    }
    if (this.state.hasDbError) {
      return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h1>Error: One or more components failed to render.</h1>
        </div>
      );
    }
    return (
      <div className="background-view">
        <IntlProvider
          locale={this.props.appLocale.locale}
          messages={this.props.appLocale.messages}
          formats={this.props.appLocale.formats}
        >
        <div className="dash-view" >
          {dashboardview}
          <Row>
            {nodeshealth}
            {chartstatus}
          </Row>
          {timelinestream}
        </div>
        </IntlProvider>
      </div>
    );
  }
}

export default DashboardView;
