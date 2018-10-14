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
import { IntlProvider } from 'react-intl';
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
        i < 100 && blockList && blockList[i];
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
    let  dashboardview = [], middle = [];

    

    for (let i = 0; i < config.dashboardview_middle.length; i++) {

      switch(config.dashboardview_middle[i]) {
        case "nodeshealth" : middle.push(
          <Col sm= '12' >
            <Card className="dash-section">
              <NodesHealth
                nodeStatus={this.props.nodeStatus}
              />
            </Card>
            
          </Col>
        ); break;
        case "chartstatus" : middle.push(
          <Col sm= '12'>
            <Card className="dash-section">
              <ChartStats appLocale= {this.props.appLocale} />
            </Card>
          </Col>
        ); break;
        case "timelinestream" : middle.push(
          <Col sm='12'>
            <Card className="dash-section">
              <TimelineStream notifications={this.state.notifications} blockList={this.props.blockList} appLocale = {this.props.appLocale}/>
            </Card>
          </Col>
        ); break;
        default: break;
      }
    }

    for (let i = 0; i < config.dashboardview.length; i++) {
      switch(config.dashboardview[i]) {
        
        case "dashboardview_middle" : dashboardview.push (<Col sm='6' className = 'padding'>
            {middle}
          </Col>
        ); break
        case "timelinestream" : dashboardview.push(
          <Col sm='6' className = 'padding'>
            <Col sm="12">
              <Card className="dash-section">
                <TimelineStream notifications={this.state.notifications} blockList={this.props.blockList} appLocale = {this.props.appLocale}/>
              </Card>
            </Col>
          </Col>
        ); break;
        case "nodeshealth" : dashboardview.push(
          <Row>
            <Col sm="12">
              <Card className="dash-section">
                <NodesHealth
                  nodeStatus={this.props.nodeStatus}
                />
              </Card>
            </Col>
          </Row>
        ); break;
        default: break;
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
          <Row>
            {dashboardview}
          </Row>
        </div>
        </IntlProvider>
      </div>
    );
  }
}

export default DashboardView;
