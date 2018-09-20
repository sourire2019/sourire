/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { LandingPage } from './LandingPage';

const setup = () => {
  const props = {
    channel: { currentChannel: 'mychannel' },
    getBlockList: jest.fn(),
    getBlocksPerHour: jest.fn(),
    getBlocksPerMin: jest.fn(),
    getContractList: jest.fn(),
    getChannel: jest.fn(),
    getChannelList: jest.fn(),
    getChannels: jest.fn(),
    getDashStats: jest.fn(),
    getNodeList: jest.fn(),
    getNodeStatus: jest.fn(),
    getTransactionByOrg: jest.fn(),
    getTransactionList: jest.fn(),
    getTransactionPerHour: jest.fn(),
    getTransactionPerMin: jest.fn(),
    updateLoadStatus: jest.fn()
  }

  const wrapper = shallow(<LandingPage {...props} />);

  return {
    props,
    wrapper
  }
};

describe('LandingPage', () => {
  test('LandingPage component should render', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });
});
