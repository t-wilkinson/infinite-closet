import React from 'react'

import { G, P, Layout } from '../layout'
import {
  Space,
  Order,
  Separator,
  MailingList,
  Heading,
  YouMayAlsoLike,
} from '../components'
import { fmtPrice } from '../utils'

const Summary = ({ left, right, ...props }) =>
  right ? (
    <G.Row {...props}>
      <G.Cell style={{ textAlign: 'right' }}>{left}:</G.Cell>
      <G.Cell style={{ textAlign: 'left' }}>
        &nbsp;&nbsp;&nbsp;{isNaN(right) ? right : fmtPrice(right)}
      </G.Cell>
    </G.Row>
  ) : null

export default ({ data }) => {
  const { cart, address, summary, contact, recommendations } = data

  return (
    <Layout title="Order Confirmation">
      <Space n={2} />
      <P>
        <p>Hi {contact.nickName},</p>
        <p>
          Thank you for your order! Your order has been processed and you will
          receive an email when it ships.
        </p>
      </P>

      <Space n={1} />

      <Heading>Your Items</Heading>
      <Separator space={false} />
      {cart.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Separator space={false} />}
          <Order {...item} />
        </React.Fragment>
      ))}
      <Separator space={false} />

      <G>
        <G.Row>
          <G.Cell className="w-full">
            <G>
              <span className="text-gray">Shipping To</span>
              {address.fullName}
              {address.mobileNumber}
              {address.addressLine1}
            </G>
          </G.Cell>
          <G.Cell>
            <table>
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <span className="text-gray">Price Summary</span>
                  </td>
                </tr>
                <Summary left="Subtotal" right={summary.subtotal} />
                <Summary
                  left="Promo Code"
                  right={summary.coupon && summary.coupon.code}
                />
                <Summary left="Shipping" right={summary.shipping || 'Free'} />
                <Summary left="Insurance" right={summary.insurance} />
                <Summary
                  left="TOTAL"
                  right={summary.total}
                  className="font-bold"
                />
              </tbody>
            </table>
          </G.Cell>
        </G.Row>
      </G>

      <Space n={2} />

      <P>
        <p>
          Need to make changes to your order? You can do so by contacting
          Customer Service at info@infinitecloset.co.uk or on Whatsapp +44 7521
          933225.
        </p>
        <p>Thanks for shopping with us!</p>
        <p>Best,</p>
        <strong>Team Infinite Closet</strong>
      </P>

      <Space n={2} />

      <Heading>You may also like</Heading>
      <Separator />
      <YouMayAlsoLike recommendations={recommendations} />

      <MailingList />
    </Layout>
  )
}
