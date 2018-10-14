/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import clientJson from '../../../package.json';
import {FormattedMessage} from 'react-intl';
import config from '../config.json';

export class FooterView extends Component {
  handleChange = (selectedOption) => {
    this.setState({ selectedOption: selectedOption.value });
    this.props.getChangeChannel(selectedOption.value);
  }

  handleThemeChange = () => {
    const theme = !this.state.isLight;
    this.setState({ isLight: theme });
  }

  render() {
    return (
      <div>
        <div class="footer">
          <FormattedMessage
            id={config.foot_id}
            values= {
              {
                foot : "Copyright © 2018 "+ config.foot+" | All rights reserved"
              }
            }
            defaultMessage= "trustchain {foot}"
            description="footer"
            />
          {""}
        </div>
      </div>
    );
  }
}

export default FooterView;
