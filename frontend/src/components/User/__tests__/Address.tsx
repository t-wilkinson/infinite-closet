import React from 'react'
import nock from 'nock'
import { Address, AddAddress } from '../Address'
import * as t from '@/utils/test'
import mockUser from '../__mocks__/user'

const mockAddress = {
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  address: 'address',
  town: 'town',
  postcode: '1234 Post',
  mobileNumber: mockUser.phoneNumber,
}

describe('Address', () => {
  it('can be created', async () => {
    const scope = nock(t.api)
      .persist()
      .post(t.Url('/account/:id/addresses'), mockAddress)
      .reply(200, {})
      .get(
        t.Url('/addresses/verify/:postcode', {
          postcode: encodeURI(mockAddress.postcode),
        })
      )
      .reply(200, { valid: true })
      .post(t.Url('/account/signin'), {})
      .reply(200, { user: mockUser })

    const onSubmit = jest.fn()
    // TODO: test each input has right values
    t.render(<AddAddress user={mockUser} onSubmit={onSubmit} />)

    const getField = (field: string) =>
      t.screen.getByLabelText(new RegExp(field, 'i'))
    const typeField = (field: string) =>
      t.userEvent.type(getField(field), mockAddress[field])
    typeField('address')
    typeField('town')
    typeField('postcode')

    t.fireEvent.click(t.screen.getByRole(/button/i))
    await t.waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })

    expect(scope.isDone())
  })

  it('can be removed', () => {
    const mockAddressId = 10
    const select = jest.fn()

    const scope = nock(t.api)
      .delete(
        t.Url('/account/:userid/addresses/:addressid', {
          userId: mockUser.id,
          addressid: mockAddressId,
        })
      )
      .reply(200)

    t.render(
      <Address
        {...mockAddress}
        selected={mockAddressId}
        select={select}
        id={mockAddressId}
        userId={mockUser.id}
      />
    )
    t.fireEvent.click(t.screen.getByLabelText(/^choose/i))
    t.fireEvent.click(t.screen.getByLabelText(/remove address/i))
    expect(select).toBeCalledTimes(1)
    expect(scope.isDone())
  })
})
