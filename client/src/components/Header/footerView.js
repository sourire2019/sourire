/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import 'react-select/dist/react-select.css';
import React, { Component } from 'react';
import clientJson from '../../../package.json';
import {FormattedMessage} from 'react-intl';

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
            id="page.localeProvider.trustchain"
            values= {
              {
                foot : "Copyright © 2018 sjclian.com | A | All rights reserved"
              }
            }
            defaultMessage="Trust chain {foot}"
            description="footer"
            />
          {""}
        </div>
      </div>
    );
  }
}

export default FooterView;
