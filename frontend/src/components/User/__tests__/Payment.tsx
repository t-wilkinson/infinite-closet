it.todo('Payment')
// import React from 'react'
// import nock from 'nock'
// import { PaymentWrapper } from '@/Form/Payment'
// import { AddPaymentMethodForm } from '../Payment'
// import * as t from '@/utils/test'
// import mockUser from '../__mocks__/user'

// const mockCard = {
//   number: '4242424242424242',
//   expiration: '424',
//   cvc: '123',
//   postcode: '42424',
// }

// describe('User payment', () => {
//   it('can be added to wallet', async () => {
//     const mockClientSecret = 'secret'
//     const scope = nock(t.api)
//       .post(t.Url('/account/wallet'))
//       .reply(200, { clientSecret: mockClientSecret })

//     const onSubmit = jest.fn()
//     const component = t.render(
//       <PaymentWrapper>
//         <AddPaymentMethodForm
//           user={mockUser}
//           onSubmit={onSubmit}
//           onClose={() => {}}
//         />
//       </PaymentWrapper>
//     )

//     const cardElement = component.container.querySelector('#card-element')
//     t.userEvent.click(cardElement)
//     // TODO: handleChange is not called
//     const typeCard = (field: string) => t.userEvent.keyboard(mockCard[field])
//     typeCard('number')
//     typeCard('expiration')
//     typeCard('cvc')
//     typeCard('postcode')

//     // const submitButton = t.screen.getByText(/submit/i)

//     // TODO: why is it still disabled?
//     // expect(submitButton).toHaveAttribute('disabled')

//     //     t.fireEvent.click(submitButton)
//     //     await t.waitFor(
//     //       () => {
//     //         expect(onSubmit).toBeCalledTimes(1)
//     //       },
//     //       {
//     //         timeout: 5000,
//     //       }
//     //     )

//     // expect(scope.isDone())
//   })
// })
