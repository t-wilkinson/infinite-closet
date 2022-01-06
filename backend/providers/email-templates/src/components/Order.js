import React from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { fmtDate, fmtPrice } from '../utils'
import { G } from '../layout'
import { Img, ButtonLink } from './'

dayjs.extend(utc)
dayjs.extend(timezone)

const styles = {
  cell: {
    verticalAlign: 'top',
  },
  img: {
    width: 80,
    height: 150,
  },
}

export const Order = ({ totalPrice, order, range, review = false }) => {
  return (
    <G style={{ tableLayout: 'fixed' }} cellPadding={16}>
      <G.Row>
        <G.Cell style={{ ...styles.cell, ...styles.img }}>
          <a
            style={{}}
            provider="frontend"
            href={`/shop/${order.product.slug}/${order.product.designer.slug}`}
          >
            <Img
              provider="backend"
              style={{ width: 60, height: 110 }}
              src={order.product.images[0].url}
              alt={order.product.images[0].alternativeText}
            />
          </a>
        </G.Cell>
        <G.Cell style={{ ...styles.cell, textAlign: 'left' }}>
          <G>
            <span>
              {order.product.name} by{' '}
              <span style={{ fontWeight: 700 }}>
                {order.product.designer.name}
              </span>
            </span>
            <span>
              {fmtDate(range.start)} - {fmtDate(range.end)}
            </span>
            <span>Size: {order.size}</span>
          </G>
        </G.Cell>
        {review ? (
          <G.Cell style={{ width: '14em', textAlign: 'right' }}>
            <ButtonLink
              href={`/shop/${order.product.designer.slug}/${order.product.slug}#reviews`}
              provider="frontend"
            >
              Review this item
            </ButtonLink>
          </G.Cell>
        ) : (
          <G.Cell style={{ ...styles.cell, width: '8em', textAlign: 'right' }}>
            <strong>{fmtPrice(totalPrice)}</strong>
          </G.Cell>
        )}
      </G.Row>
    </G>
  )
}

export const OrderSummary = () => {}

export default Order
