/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import { ContractModal } from './ContractModal';

const setup = () => {
  const props = {
    contract: {
      contractname: 'mycc',
      channelName: 'mychannel',
      path: 'github.com/contract/contract_example02/go/',
      source: 'Location not found',
      txCount: 32,
      version: '1.0',
    },
    classes: {
      container: 'ContractModal-container-89',
      container1: 'ContractModal-container1-90'
    }
  }

  const wrapper = shallow(<ContractModal {...props} />);

  return {
    props,
    wrapper
  }
};

describe('ContractModal', () => {
  test('ContractModal component should render', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
  });
});
