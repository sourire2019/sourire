/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import "react-select/dist/react-select.css";
import React, {Component} from "react";
import compose from "recompose/compose";
import {connect} from "react-redux";
import {withStyles} from "material-ui/styles";
import Select from "react-select";
import {Nav, Navbar, NavbarBrand, NavbarToggler} from "reactstrap";
import {HashRouter as Router, NavLink, Link} from "react-router-dom";
import Switch from "material-ui/Switch";
import Logo from "../../static/images/logo.png";
import FontAwesome from "react-fontawesome";
import Drawer from "material-ui/Drawer";
import Button from "material-ui/Button";
import Websocket from "react-websocket";
import Badge from "material-ui/Badge";
import Dialog from "material-ui/Dialog";
import Loader from 'react-loader-spinner';
import {chartOperations, chartSelectors} from "../../state/redux/charts/";
import {tableOperations, tableSelectors} from "../../state/redux/tables/";
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import config  from '../config.json';
import {
  Row,
  Col
} from 'reactstrap';
import Avatar from 'material-ui/Avatar';

var src = require("../../static/images/" + config[config.logo].logo);
const {
  blockPerHour,
  blockPerMin,
  transactionPerHour,
  transactionPerMin,
  transactionByOrg,
  dashStats,
  changeChannel,
  nodeStatus
} = chartOperations;

const {blockList, contractList, nodeList, transactionList} = tableOperations;

const {currentChannelSelector, dashStatsSelector} = chartSelectors;
const {channelsSelector} = tableSelectors;

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  menuButtons: {
    margin: theme.spacing.unit,
    fontSize: "1.05rem !important",
    fontWeight: "800"
  }
});

export class HeaderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      notifyDrawer: false,
      adminDrawer: false,
      channels: [],
      notifyCount: 0,
      notifications: [],
      isLoading: true,
      modalOpen: false,
      selectedChannel: {},
      isLight: true,
      langSelectedIndex: 1,
      value : 1
    };
    
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  val (value) {
    this.setState({
      value: value === 0? 1 : 0
    });
  };
  handleData(notification) {
    let notifyArr = this.state.notifications;
    notifyArr.unshift(JSON.parse(notification));
    this.setState({notifications: notifyArr});
    this.setState({notifyCount: this.state.notifyCount + 1});
  }

  componentDidMount() {
    let arr = [];
    let selectedValue ={}
    if (this.props.channels) {
      this.props.channels.forEach(element => {
      if (element.genesis_block_hash === this.props.currentChannel) {
        selectedValue = {
          value: element.genesis_block_hash,
          label: element.channelname
        };

      }
      arr.push({
        value: element.genesis_block_hash,
        label: element.channelname
      });
    });
    }
    this.setState({
      channels: arr,
      isLoading: false,
      selectedChannel: selectedValue
    });

    setInterval(() => this.syncData(this.props.currentChannel), 60000);
  }

  async syncData(currentChannel) {
    await Promise.all([
      this.props.getBlockList(currentChannel),
      this.props.getBlocksPerMin(currentChannel),
      this.props.getBlocksPerHour(currentChannel),
      this.props.getContractList(currentChannel),
      this.props.getDashStats(currentChannel),
      this.props.getNodeList(currentChannel),
      this.props.getNodeStatus(currentChannel),
      this.props.getTransactionByOrg(currentChannel),
      this.props.getTransactionList(currentChannel),
      this.props.getTransactionPerHour(currentChannel),
      this.props.getTransactionPerMin(currentChannel)
    ]);
    this.dashStats = this.props.getDashStats(currentChannel);
    this.handleClose();
  }

  componentWillReceiveProps(nextProps) {
    let options = [];
    let selectedValue = {};
    nextProps.channels.forEach(element => {
      options.push({
        value: element.genesis_block_hash,
        label: element.channelname
      });
      if (
        nextProps.currentChannel == null ||
        nextProps.currentChannel == undefined
      ) {
        if (element.genesis_block_hash != null) {
          selectedValue = {
            "value": element.genesis_block_hash,
            "label": element.channelname
          };
        }
      } else if (element.genesis_block_hash === nextProps.currentChannel) {
        selectedValue = {
          value: element.genesis_block_hash,
          label: element.channelname
        };
      }
    });
    

    if (
      nextProps.currentChannel == null ||
      nextProps.currentChannel == undefined
    ) {
      this.props.getChangeChannel(selectedValue.value);
    }

    this.setState({
      channels: options,
      isLoading: false,
      selectedChannel: selectedValue
    });
    if (nextProps.currentChannel !== this.props.currentChannel) {
      this.syncData(nextProps.currentChannel);
    }
  }

  handleChange = async ( selectedChannel) => {
   await this.handleOpen();
    console.log(this.state.modalOpen);
    this.setState({selectedChannel});
    this.props.getChangeChannel(selectedChannel.value);
   await this.syncData(selectedChannel.value);
  };

  handleOpen = () => {
    console.log("opened model");
    this.setState({modalOpen: true});
  };

  handleClose = () => {
    this.setState({modalOpen: false});
  };


  handleThemeChange = () => {
    const theme =
    sessionStorage.getItem("toggleTheme") === "true" ? false : true;
    sessionStorage.setItem("toggleTheme", theme);
    this.setState({isLight: theme});
    this.props.refresh(theme);
  };
  render() {
    const {classes} = this.props;
    const {hostname, port} = window.location;
    var webSocketUrl = `ws://${hostname}:${port}/`;
    const themeIcon = sessionStorage.getItem("toggleTheme") === "true";
    const dashLink = props => (
      <Link to="/" exact activeClassName="active" {...props} />
    );
    const transLink = props => (
      <Link to="/transactions" activeClassName="active" {...props} />
    );

    const header = [], status = [];
    for (let i = 0; i < config.header.length; i++) {
      switch(config.header[i]) {
        case "dashboardview" : header.push(<li>
                  <NavLink
                    to="/"
                    exact
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.dashboard"
                    defaultMessage="DASHBOARD"
                    description="DASHBOARD"
                    />
                  </NavLink>
                </li> ); break;
        case "blocksview": header.push( <li>
                  <NavLink
                    to="/blocks"
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.blocks"
                    defaultMessage="BLOCKS"
                    description="BLOCKS"
                    />
                  </NavLink>
                </li> ); break;
        case "contractview" : header.push( <li>
                  <NavLink
                    to="/contracts"
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.contracts"
                    defaultMessage="CONTRACTS"
                    description="CONTRACTS"
                    />
                    
                  </NavLink>
                </li> ); break;
        case "channelsview" : header.push( <li>
                  <NavLink
                    to="/channels"
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.channels"
                    defaultMessage="CHANNELS"
                    description="CHANNELS"
                    />
                    
                  </NavLink>
                </li> ); break;
        case "networkview" : header.push( <li>
                  <NavLink
                    to="/network"
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.network"
                    defaultMessage="NETWORK"
                    description="network"
                    />
                  </NavLink>
                </li> ); break;
        case "transactionsview" :header.push( <li>
                  <NavLink
                    to="/transactions"
                    className="dashButtons"
                    activeClassName="activeTab"
                  >
                    <FormattedMessage
                    id="page.localeProvider.transactions"
                    defaultMessage="TRANSACTIONS"
                    description="TRANSACTIONS"
                    />
                    
                  </NavLink>
                </li> ); break;
        case "select" : header.push(
          <div>
            <Select
              className="channel-dropdown"
              placeholder="Select Channel..."
              required={true}
              name="form-field-name"
              isLoading={this.state.isLoading}
              value={this.state.selectedChannel}
              onChange={this.handleChange}
              options={this.state.channels}
            />
          </div>
        ); break; 
        case "language" : header.push(
          <div  className="admin-buttons theme-switch" onClick= {() => {
          this.props.onChange(this.state.value); this.val(this.state.value)}}>
            <FontAwesome name="language" className="langIcon" />
          </div>
        ); break;
        case "theme" : header.push(
          <div className="admin-buttons theme-switch">
            <FontAwesome name="sun-o" className="sunIcon" />
            <Switch
              onChange={() => this.handleThemeChange()}
              checked={themeIcon}
            />
            <FontAwesome name="moon-o" className="moonIcon" />
          </div>
        ); break;
        case "github" : header.push(
          <div  className="admin-buttons theme-switch" >
            <NavbarBrand href="https://github.com/DSiSc/justitia">
              <FontAwesome name="github" className="github" />
            </NavbarBrand>
          </div>
        ); break;
        default:  break;
      }
    }
    for (let i = 0; i < config.status.length; i++) {

      switch(config.status[i]) {
        case "blocks" : status.push(
          <div className="statistic vdivide" style={{ width: (100/config.status.length) +'%' }}>
            <Row>
              <Col sm= "4">
                <Avatar className="stat-avatar avatar-block" >
                  <FontAwesome name="cube" />
                </Avatar>
              </Col>
              <Col sm= "4">
                <h1 className="stat-count">{this.props.dashStat.latestBlock}</h1>
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
              <Col sm= "4">
                <Avatar className="stat-avatar avatar-tx" >
                  <FontAwesome name="list-alt" />
                </Avatar>
              </Col>
              <Col sm= "4">
                <h1 className="stat-count">{this.props.dashStat.txCount}</h1>
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
                    <Col sm= "4">
                      <Avatar className="stat-avatar avatar-node" >
                        <FontAwesome name="users" />
                      </Avatar>
                    </Col>
                    <Col sm= "4">
                      <h1 className="stat-count">{this.props.dashStat.nodeCount}</h1>
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
                    <Col sm= "4">
                      <Avatar className="stat-avatar avatar-contract" >
                        <FontAwesome name="handshake-o" />
                      </Avatar>
                    </Col>
                    <Col sm= "4">
                      <h1 className="stat-count">{this.props.dashStat.contractCount}</h1>
                    </Col>
                  </Row>
                  <FormattedMessage
                    id="page.localeProvider.contracts"
                    defaultMessage="CONTRACTS"
                    description="CONTRACTS"
                    />
                  
                </div>); break;
        default:  break;
      }
    }
    return (
      <div>
        <Websocket
          url={webSocketUrl}
          onMessage={this.handleData.bind(this)}
          reconnect={true}
        />
        <Router>
          <div>
            <Navbar className="navbar-header" expand="md" fixed="top">
              <NavbarBrand href="/">
                {" "}
                <img src={src} className="logo" alt={config.logo} />
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Nav className="ml-auto " navbar>
                <Row>
                  {header}
                </Row>
                <Row>
                  {status}
                </Row>
                
                
              </Nav>
            </Navbar>
            <Drawer
              anchor="right"
              open={this.state.adminDrawer}
              onClose={() => this.handleDrawClose("adminDrawer")}
            >
              
            </Drawer>
              <Dialog
                open={this.state.modalOpen}
                onClose={this.handleClose}
                fullWidth={false}
                maxWidth={"md"}
              >
                <div className="channel-loader">
                  <h4 className="loader-message" >Loading Channel Details</h4>
                  <Loader type="ThreeDots"
                    color="#005069"
                    height={70}
                    width={70}
                    className="loader" />
                </div>
              </Dialog>
          </div>
        </Router>
        
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(
    state => ({
      currentChannel: currentChannelSelector(state),
      channels: channelsSelector(state),
      dashStat: dashStatsSelector(state)
    }),
    {
      getBlockList: blockList,
      getBlocksPerHour: blockPerHour,
      getBlocksPerMin: blockPerMin,
      getContractList: contractList,
      getChangeChannel: changeChannel, //not in syncdata
      getDashStats: dashStats,
      getNodeList: nodeList,
      getNodeStatus: nodeStatus,
      getTransactionByOrg: transactionByOrg,
      getTransactionList: transactionList,
      getTransactionPerHour: transactionPerHour,
      getTransactionPerMin: transactionPerMin
    }
  )
)(HeaderView);
