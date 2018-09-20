/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import Nodes from "./Nodes";
import ReactTable from 'react-table';

const setup = () => {
  const props = {
    nodeList: [
      {
        requests: "grpcs://127.0.0.1:7051",
        server_hostname: "node0.org1.example.com"
      },
      {
        requests: "grpcs://127.0.0.1:8051",
        server_hostname: "node1.org1.example.com"
      },
      {
        requests: "grpcs://127.0.0.1:9051",
        server_hostname: "node0.org2.example.com"
      },
      {
        requests: "grpcs://127.0.0.1:10051",
        server_hostname: "node1.org2.example.com"
      }
    ]
  };

  const wrapper = mount(<Nodes {...props} />);

  return {
    props,
    wrapper
  }
};

describe("Nodes", () => {
  test("Nodes and ReactTable components should render", () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(ReactTable).exists()).toBe(true);
  });

  test("Table displays node data", () => {
    const { wrapper } = setup();
    // node Names
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('node0.org1.example.com')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('node1.org1.example.com')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('node0.org2.example.com')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('node1.org2.example.com')).exists()).toBe(true);
    // Endpoint
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('grpcs://127.0.0.1:7051')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('grpcs://127.0.0.1:8051')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('grpcs://127.0.0.1:9051')).exists()).toBe(true);
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('grpcs://127.0.0.1:10051')).exists()).toBe(true);
  });

  test("Simulate Node Name filterMethod should have two result when given a value of node0", () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '0-server_hostname').find('input').simulate('change', {target: {value: 'node0'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(2);
  });

  test("Simulate Endpoint filterMethod should have one result when given a value of 9", () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '1-requests').find('input').simulate('change', {target: {value: '9'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('pagination when nodeList is greater than 4', () => {
    const { wrapper, props } = setup()
    const nodes = props.nodeList
    const node = {
      requests: "grpcs://127.0.0.1:7051",
      server_hostname: "node0.org1.example.com"
    }
    nodes.push(node)
    expect(wrapper.find('.pagination-bottom').exists()).toBe(false)
    wrapper.setProps({ nodeList: nodes })
    expect(wrapper.find('.pagination-bottom').exists()).toBe(true)
  })
});
