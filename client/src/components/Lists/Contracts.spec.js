/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import Contracts from './Contracts';
import ReactTable from 'react-table';

jest.useFakeTimers();

const setup = () => {
  const props = {
    contractList: [
      {
        contractname: 'mycc',
        channelName: 'mychannel',
        path: '"github.com/contract/contract_example02/go/"',
        txCount: 33,
        version: '1.0'
      }
    ],
    channel: {
      currentChannel: 'mychannel'
    },
    countHeader: {
      contractCount: '1',
      latestBlock: 20,
      nodeCount: '4',
      txCount: '36'
    },
    getContracts: jest.fn()
  };

  const contract = {
    contractname: 'mycc',
    channelName: 'mychannel',
    path: 'github.com/contract/contract_example02/go/',
    source: 'Location not found',
    txCount: 32,
    version: '1.0',
  }

  const wrapper = mount(<Contracts {...props} />);

  return {
    contract,
    props,
    wrapper
  };
};

describe('Contracts', () => {
  test('Contracts and ReactTable components should render', () => {
    const { wrapper } = setup();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(ReactTable).exists()).toBe(true);
  });

  test('Table displays contract data', () => {
    const { wrapper } = setup();
    // Contract Name
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('mycc')).exists()).toBe(true);
    // Channel Name
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('mychannel')).exists()).toBe(true);
    // Path
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('"github.com/contract/contract_example02/go/"')).exists()).toBe(true);
    //Transition Count
    expect(wrapper.find('TdComponent').findWhere(n => n.contains(33)).exists()).toBe(true);
    //Version
    expect(wrapper.find('TdComponent').findWhere(n => n.contains('1.0')).exists()).toBe(true);
  });

  test('Simulate Contract Name filterMethod should have one result when given a value of mycc', () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '0-contractname').find('input').simulate('change', {target: {value: 'mycc'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('Simulate Channel Name filterMethod should have one result when given a value of mychannel', () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '1-channelName').find('input').simulate('change', {target: {value: 'mychannel'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('Simulate Path filterMethod should have one result when given a value of github', () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '2-path').find('input').simulate('change', {target: {value: 'github'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('Simulate Transaction Count filterMethod should have one result when given a value of 33', () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '3-txCount').find('input').simulate('change', {target: {value: '33'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('Simulate Version filterMethod should have one result when given a value of 1', () => {
    const { wrapper } = setup();
    wrapper.find('ThComponent').findWhere(n => n.key() === '4-version').find('input').simulate('change', {target: {value: '1'}});
    expect(wrapper.find(ReactTable).find('TrGroupComponent').length).toBe(1);
  });

  test('handleDialogOpen sets state to true', () => {
    const { wrapper } = setup();
    wrapper.instance().handleDialogOpen();
    expect(wrapper.state('dialogOpen')).toBe(true)
  })

  test('handleDialogClose sets state to false', () => {
    const { wrapper } = setup();
    wrapper.setState({ dialogOpen: true })
    wrapper.instance().handleDialogClose();
    expect(wrapper.state('dialogOpen')).toBe(false)
  })

  test('sourceDialogOpen', () => {
    const { wrapper, contract } = setup();
    wrapper.instance().sourceDialogOpen(contract);
    expect(wrapper.state('sourceDialog')).toBe(true)
    expect(wrapper.state('contract')).toBe(contract)
  })

  test('sourceDialogClose sets state to false', () => {
    const { wrapper, contract } = setup();
    wrapper.instance().sourceDialogOpen(contract);
    wrapper.instance().sourceDialogClose();
    expect(wrapper.state('sourceDialog')).toBe(false)
  })

  test('pagination when contracts is greater than 4', () => {
    const { wrapper, contract } = setup()
    const contracts = [contract, contract, contract, contract, contract, contract]
    expect(wrapper.find('.pagination-bottom').exists()).toBe(false)
    wrapper.setProps({ contractList: contracts })
    expect(wrapper.find('.pagination-bottom').exists()).toBe(true)
  })

/*   test('button onClick', () => {
    const { wrapper } = setup();
    wrapper.find('Button').simulate('click')
    expect(wrapper.state('dialogOpen')).toBe(true)
  }) */
});
