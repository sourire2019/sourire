/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Timeline, TimelineEvent ,TimelineComponent } from 'react-event-timeline';
import Dialog from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import { Badge } from 'reactstrap';
import Timeago from 'react-timeago';
import find from 'lodash/find';
import BlockView from '../View/BlockView';
import blockOpen from '../../static/images/blockOpen.png';
import {
  Row,
  Col
} from 'reactstrap';
import {FormattedMessage} from 'react-intl';
import { IntlProvider } from 'react-intl';

class TimelineStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notifications: [],
      dialogOpenBlockHash: false,
      blockHash: {}
    };
  }

  handleDialogOpenBlockHash = rowValue => {
    const data = find(this.props.blockList, item => {
      return item.blockhash === rowValue;
    });
    this.setState({
      dialogOpenBlockHash: true,
      blockHash: data });
  };

  handleDialogCloseBlockHash = () => {
    this.setState({ dialogOpenBlockHash: false });
  };

  handlewheel = (event) =>{
    const ev = window.event || event;
    ev.preventDefault();  
            //设置鼠标滚轮滚动时屏幕滚动条的移动步长  
            var step = 20;  
            if(ev.deltaY < 0){ 
                //向上滚动鼠标滚轮，屏幕滚动条左移  
                document.getElementsByClassName("scrollable-card")[0].scrollLeft -= step;
            } else {  
                //向下滚动鼠标滚轮，屏幕滚动条右移   
                 document.getElementsByClassName("scrollable-card")[0].scrollLeft += step;
            }  

  }

  render() {
    return (
      <div onWheel= {() =>this.handlewheel()}>
        <div className="scrollable-card" >
          
          <div className= "scroll-div" >
            {this.props.notifications.map(item => (
              <div className= "scoll">

              <TimelineEvent
                key={item.title}
                title={item.title}
                icon={<FontAwesome name="cube" />}
                iconColor="#0D3799"
                container="card"
                className="timeline-event"
                titleStyle={{ fontWeight: "bold" }}
                style={{ float : "left", width : "100%"}}
                cardHeaderStyle={{
                  backgroundColor: "#6283D0",
                  fontSize: "13pt"
                }}
                contentStyle={{
                  backgroundColor: "transparent"
                }}
                buttons={
                  <a
                    className="blockLink"
                    href="#/"
                    onClick={() =>
                      this.handleDialogOpenBlockHash(item.blockhash)
                    }
                  >
                    <img
                      src={blockOpen}
                      alt="View Blocks"
                      className="blockOpen"
                    />
                  </a>
                }
              >
                <Typography variant="body1">
                  <b className="timeLineText"> 
                    <FormattedMessage
                      id="page.localeProvider.datah"
                      defaultMessage="Data Hash"
                      description="Data Hash"
                      />:
                    </b>
                    <br />
                    {item.datahash === "" ? (<br/>): (item.datahash)}{""}
                    <br />
                  <b className="timeLineText"> 
                    <FormattedMessage
                      id="page.localeProvider.num"
                      defaultMessage="Number of Tx"
                      description="Number of Tx"
                    />:
                  </b> {item.txcount}
                </Typography>
                <h5 className="timeLineText">
                  <Badge className="timeLineText">
                    <Timeago
                      className="timeLineText"
                      date={item.time}
                      live={false}
                      minPeriod={60}
                    />
                  </Badge>
                </h5>
              </TimelineEvent>
              </div>
            ))}
          </div>
        </div>
        <Dialog
          open={this.state.dialogOpenBlockHash}
          onClose={this.handleDialogCloseBlockHash}
          fullWidth={true}
          maxWidth={"md"}
        >
          <IntlProvider
            locale={this.props.appLocale.locale}
            messages={this.props.appLocale.messages}
            formats={this.props.appLocale.formats}
          >
            <BlockView
              blockHash={this.state.blockHash}
              onClose={this.handleDialogCloseBlockHash}
            />
          </IntlProvider>
        </Dialog>
        
      </div>
    );
  }
}

export default TimelineStream;
