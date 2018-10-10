/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import ContractForm from './ContractForm'

const setup = () => {
  const wrapper = shallow(<ContractForm />)

  return {
    wrapper
  }
}

describe('ContractForm', () => {
  test('ContractForm component should render', () => {
    const { wrapper } = setup()
    expect(wrapper.exists()).toBe(true)
  })
})
