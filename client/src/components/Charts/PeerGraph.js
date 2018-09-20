/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { Graph } from 'react-d3-graph';
import { Card, CardHeader, CardBody } from 'reactstrap';
import 'react-tree-graph/dist/style.css';

class NodeGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        nodes: [
          { id: 'child1' },
          { id: 'child2' },
          { id: 'child3' },
          { id: 'child4' }
        ],
        links: [
          { source: 'child1', target: 'child2' },
          { source: 'child2', target: 'child3' },
          { source: 'child3', target: 'child4' },
          { source: 'child4', target: 'child1' }
        ]
      },
      myConfig: {
        height: 300,
        width: 600,
        maxZoom: 1.5,
        minZoom: 1.5,
        node: {
          fontSize: 10,
          fontWeight: "bold",
          labelProperty: "id",
          color: '#5bc5c2',
          size: 200
        },
        links: {
          "color": "#d3d3d3",
          "strokeWidth": 1.5,
        }
      }
    }
  }

  nodeDataSetup = (nodeData) => {
    let nodes = [];
    let links = [];
    for (var i = 0; i < nodeData.length; i++) {
      nodes[i] = { id: nodeData[i].server_hostname };
      if (i < (nodeData.length - 1)) {
        links[i] = {
          source: nodeData[i].server_hostname,
          target: nodeData[i + 1].server_hostname
        };
      } else {
        links[i] = {
          source: nodeData[i].server_hostname,
          target: nodeData[0].server_hostname
        };
      }
    }

    this.setState({
      data: {
        nodes: nodes,
        links: links
      }
    });
  }

  componentDidMount() {
    this.nodeDataSetup(this.props.nodeList)
  }

  render() {
    return (
      <div className="node-graph">
        <Card>
          <CardHeader>
            <h5>NodeGraph</h5>
          </CardHeader>
          <CardBody className="nodeGraphBody">
            <Graph id="graph-id"
              data={this.state.data}
              config={this.state.myConfig} />
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default NodeGraph;
