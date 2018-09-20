/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import NodesHealth from "./NodesHealth";
import ReactTable from 'react-table';
import nock from 'nock';

const setup = () => {
  const props = {
    nodeStatus: [
      {
        status: "UP",
        server_hostname: "node0.org1.example.com"
      },
      {
        status: "UP",
        server_hostname: "node1.org1.example.com"
      },
      {
       status: "UP",
        server_hostname: "node0.org2.example.com"
      },
      {
        status: "DOWN",
        server_hostname: "node1.org2.example.com"
      }
    ]
  };

  const wrapper = mount(<NodesHealth {...props} />);

  return {
    props,
    wrapper
  }
};

describe("NodesHealth", () => {
  test("NodesHealth and ReactTable components should render", () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(ReactTable).exists()).toBe(true);
  });
});
