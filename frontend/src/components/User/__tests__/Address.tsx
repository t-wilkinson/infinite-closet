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

describe.skip('<AddAddress />', () => {
  const onSubmit = jest.fn()

  it('can be added', async () => {
    t.render(<AddAddress user={mockUser} onSubmit={onSubmit} />)

    // it.concurrent('can enter fields', () => {
    const getField = (field: string) =>
      t.screen.getByLabelText(new RegExp(field, 'i'))
    const typeField = (field: string) =>
      t.userEvent.type(getField(field), mockAddress[field])
    typeField('address')
    typeField('town')
    typeField('postcode')
    // })

    // it.concurrent('has fields that were typed in', () => {
    expect(t.screen.getByDisplayValue(mockUser.firstName)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockUser.lastName)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockAddress.address)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockAddress.town)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockAddress.postcode)).toBeInTheDocument()
    // })

    // it.concurrent('can be submitted', async () => {
    const scope = nock(t.api)
      .persist()
      .post(t.Url('/account/:id/addresses'), mockAddress)
      .reply(200, {})
      .get(
        t.Url('/addresses/verify/:postcode', {
          postcode: mockAddress.postcode,
        })
      )
      .reply(200, { valid: true })
      .post(t.Url('/account/signin'), {})
      .reply(200, { user: mockUser })

    t.fireEvent.click(t.screen.getByRole(/button/i))
    await t.waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })
    expect(scope.isDone())
    // })
  })
})

describe('<Address />', () => {
  const select = jest.fn()
  const addressId = 10

  it('can be removed', async () => {
    t.render(
      <Address
        {...mockAddress}
        selected={addressId}
        select={select}
        id={addressId}
        userId={mockUser.id}
      />
    )

    // it('can be focused', async () => {
    t.fireEvent.click(t.screen.getByLabelText(/^choose/i))
    await t.waitFor(() => {
      expect(select).toBeCalledTimes(1)
    })
    // })

    // it('can be removed', () => {
    const scope = nock(t.api)
      .delete(
        t.Url('/account/:userid/addresses/:addressid', {
          userid: mockUser.id,
          addressid: addressId,
        })
      )
      .reply(200)

    t.fireEvent.click(t.screen.getByLabelText(/remove address/i))
    expect(scope.isDone())
    // })
  })
})
