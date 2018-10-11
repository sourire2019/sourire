/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react'
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Nodes from '../Lists/Nodes'
import Card from 'material-ui/Card'
import { IntlProvider } from 'react-intl'

const styles = theme => ({
  root: {
    flexGrow: 1,
    paddingTop: 42,
    position: 'relative'
  },
  card: {
    height: 250,
    minWidth: 1290,
    margin: 20,
    textAlign: 'left',
    display: 'inline-block'
  },
  title: {
    fontSize: 16,
    color: theme.palette.text.secondary,
    position: 'absolute',
    left: 40,
    top: 60
  },
  content: {
    fontSize: 12,
    color: theme.palette.text.secondary,
    position: 'absolute',
    left: 40,
    top: 70
  }
})

export class NetworkView extends Component {
  render () {
    return (
      <div className='view-fullwidth'>
        <IntlProvider
          locale={this.props.appLocale.locale}
          messages={this.props.appLocale.messages}
          formats={this.props.appLocale.formats}
        >
          <div className='view-display'>
            <Card className='table-card'>
              <Nodes nodeList={this.props.nodeList} />
            </Card>
          </div>
        </IntlProvider>
      </div>
    )
  }
}

NetworkView.propTypes = {
  classes: PropTypes.object.isRequired,
  nodeList: PropTypes.array.isRequired
}

export default compose(
  withStyles(styles)
)(NetworkView)
