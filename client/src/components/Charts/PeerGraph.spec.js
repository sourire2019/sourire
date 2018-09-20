/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import NodeGraph from './NodeGraph';

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
  }

  const wrapper = shallow(<NodeGraph {...props} />);

  return{
    props,
    wrapper }
}

describe('NodeGraph', () => {
  test("NodeGraph component should render", () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });
});
