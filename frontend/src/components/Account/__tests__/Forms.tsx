import React from 'react'
import nock from 'nock'
import Signin from '../Signin'
import Register from '../Register'
import * as t from '@/utils/test'
import mockUser from '@/User/__mocks__/user'

describe('User', () => {
  it('can sign in ', async () => {
    const scope = nock(t.api)
      .post('/auth/local', {
        identifier: mockUser.email,
        password: mockUser.password,
      })
      .reply(200, { user: mockUser })

    const typeField = (field: string, value: string) =>
      t.userEvent.type(t.screen.getByLabelText(new RegExp(field)), value)

    const onSubmit = jest.fn()
    t.render(<Signin onSubmit={onSubmit} />)
    typeField('Email Address', mockUser.email)
    typeField('Password', mockUser.password)

    expect(t.screen.getByDisplayValue(mockUser.email)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockUser.password)).toBeInTheDocument()

    t.userEvent.click(t.screen.getByLabelText('Submit form'))
    await t.waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })
    expect(scope.isDone())
  })

  it('can register', async () => {
    const scope = nock(t.api)
      .post('/auth/local/register', {
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        password: mockUser.password,
      })
      .reply(200, { user: mockUser })

    const typeField = (field: string, value: string) =>
      t.userEvent.type(t.screen.getByLabelText(new RegExp(field)), value)

    const onSubmit = jest.fn()
    t.render(<Register onSubmit={onSubmit} />)
    typeField('First Name', mockUser.firstName)
    typeField('Last Name', mockUser.lastName)
    typeField('Email Address', mockUser.email)
    typeField('Password', mockUser.password)

    expect(t.screen.getByDisplayValue(mockUser.firstName)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockUser.lastName)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockUser.email)).toBeInTheDocument()
    expect(t.screen.getByDisplayValue(mockUser.password)).toBeInTheDocument()

    t.userEvent.click(t.screen.getByLabelText('Submit form'))
    await t.waitFor(() => {
      expect(onSubmit).toBeCalledTimes(1)
    })
    expect(scope.isDone())
  })
})
