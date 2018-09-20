/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, {Component} from "react";
import {withStyles} from "material-ui/styles";
import PropTypes from "prop-types";
import beautify from "js-beautify";
import FontAwesome from "react-fontawesome";
import {Card, CardBody, CardTitle} from "reactstrap";

const styles = theme => ({
  container: {
    border: "3px solid #afeeee"
  },
  container1: {
    display: "flex",
    flexWrap: "wrap"
  }
});

export class ContractModal extends Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillMount() {
    const theme = sessionStorage.getItem("toggleTheme") === "true";
    this.setState({toggleClass: theme});
  }

  render() {
    const formattedSrc = beautify(this.props.contract.source, {
      indent_size: 4
    });
    const srcHeader =
      this.props.contract.contractname + " " + this.props.contract.version;
    const {classes} = this.props;

    return (
      <div className={this.state.toggleClass ? "dark-theme" : ""}>
        <div className="dialog">
          <Card>
            <CardTitle className="dialogTitle">
              <FontAwesome name="file-text" className="cubeIcon" />
              {srcHeader}
            </CardTitle>
            <CardBody>
              <label className="source-code" readOnly>
                {formattedSrc}
              </label>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }
}

ContractModal.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContractModal);
