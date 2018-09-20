/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { ContractView } from './ContractView';

const setup = () => {
  const props = {
    contract: {
      contractname: 'mycc',
      channelName: 'mychannel',
      source: 'Location not found',
      txCount: 32,
      version: '1.0',
    },
    classes: {
      container: 'ContractView-container-113',
      container1: 'ContractView-container1-114'
    }
  }

  const wrapper = shallow(<ContractView {...props} />);

  return {
    props,
    wrapper
  }
};

describe('ContractView', () => {
  test('ContractView component should render', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });
});
