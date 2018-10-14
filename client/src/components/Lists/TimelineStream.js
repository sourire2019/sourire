/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import Dialog from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';
import Typography from 'material-ui/Typography';
import { Badge } from 'reactstrap';
import Timeago from 'react-timeago';
import find from 'lodash/find';
import BlockView from '../View/BlockView';
import blockOpen from '../../static/images/blockOpen.png';
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


  render() {
    return (
      <div>
        <div className="scrollable-card">
          <Timeline>
            {this.props.notifications.map(item => (
              <TimelineEvent
                key={item.title}
                title={item.title}
                icon={<FontAwesome name="cube" />}
                iconColor="#0D3799"
                container="card"
                className="timeline-event"
                titleStyle={{ fontWeight: "400" }}
                style={{ width: "100%" }}
                cardHeaderStyle={{
                  backgroundColor: "#6283D0",
                  fontSize: "11pt"
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
                      id="page.localeProvider.blockhash"
                      defaultMessage="Block Hash"
                      description="Block Hash"
                      />:
                    </b>
                    {item.blockhash === "" ? (""): (item.blockhash.slice(0, 18) )}
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
            ))}
          </Timeline>
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
