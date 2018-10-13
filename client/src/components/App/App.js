/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from "react";
import Main from "../Main";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { createMuiTheme } from "material-ui/styles";
import indigo from "material-ui/colors/indigo";
import lightBlue from "material-ui/colors/lightBlue";
import red from "material-ui/colors/red";
import HeaderView from "../Header/HeaderView";
import FooterView from "../Header/footerView";
import LandingPage from "../View/LandingPage";
import "../../static/css/main.css";
import "../../static/css/main-dark.css";
import "../../static/css/load.css";
import chartsOperations from '../../state/redux/charts/operations'
import tablesOperations from '../../state/redux/tables/operations'
import { IntlProvider, addLocaleData } from 'react-intl';

const {
  blockPerHour,
  blockPerMin,
  transactionPerHour,
  transactionPerMin,
  transactionByOrg,
  notification,
  dashStats,
  channel,
  channelList,
  changeChannel,
  nodeStatus
} = chartsOperations

const {
  blockList,
  contractList,
  channels,
  nodeList,
  transactionInfo,
  transactionList
} = tablesOperations
const muiTheme = createMuiTheme({
  palette: {
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: indigo,
    secondary: lightBlue,
    error: {
      main: red[500]
    },
    toggleClass: true
  }
});

function getLocale(lang) {
  /* eslint-disable global-require */
  let result = {};
  switch (lang) {
    case 'zh-CN':
      result = require('../locales/zh-Hans');
      break;
    case 'en-US':
      result = require('../locales/en-US');
      break;
    default:
      result = require('../locales/en-US');
  }

  return result.default || result;
  /* eslint-enable global-require */
}

class App extends Component {
  constructor(props) {
    super(props);
    this.refreshComponent = this.refreshComponent.bind(this);
    this.state = {
      loading: true,
      lang: 'en-US',
    };
  }

  onChange = (index) => {
    const lang = index === 0 ? 'en-US' : 'zh-CN';
    this.setState({
      lang,
    });
  }

  componentWillMount() {
    //Check if sessionStorage is true, then theme is true, else false.
    const theme = sessionStorage.getItem("toggleTheme") === "true";
    this.setState({ toggleClass: theme });
    theme
      ? (document.body.className = "dark-theme")
      : (document.body.className = "");
    theme
      ? (document.body.style.backgroundColor = "#242036")
      : (document.body.style.backgroundColor = "#F0F5F9");
  }

  updateLoadStatus = () => {
    this.setState({ loading: false })
  }
  refreshComponent = val => {
    this.setState({ toggleClass: val });
    this.state.toggleClass
      ? (document.body.style.backgroundColor = "#F0F5F9")
      : (document.body.style.backgroundColor = "#242036");
    this.state.toggleClass
      ? (document.body.className = "")
      : (document.body.className = "dark-theme");
  };

  render() {
    const { lang } = this.state;

    const appLocale = getLocale(lang);
    addLocaleData(...appLocale.data);

    if (this.state.loading) {
      return <LandingPage
        updateLoadStatus={this.updateLoadStatus}
      />;
    }
    
    return (
      <MuiThemeProvider theme={muiTheme}>
        <IntlProvider
          locale={appLocale.locale}
          messages={appLocale.messages}
          formats={appLocale.formats}
        >
        <div>
          
            <HeaderView refresh={this.refreshComponent.bind(this)} onChange={(index) => { this.onChange(index); }} dashStat = {dashStats}/>
          
            <Main  appLocale= {getLocale(this.state.lang)}/>
            <div class="footerView">
                <FooterView />
             
            </div>
          
        </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}
export default App;
