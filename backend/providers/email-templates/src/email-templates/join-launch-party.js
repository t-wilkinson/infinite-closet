import React from 'react'
import { Layout, Grid, Between } from '../layout'
import Icon from '../components/Icon'
import { fmtPrice } from '../utils'

const Summary = ({ guests, ticketPrice, discount, donation, total }) => {
  return (
    <Grid>
      <h3 style={{ margin: 0, marginTop: 16 }}>Order Summary</h3>
      <div
        style={{
          height: 2,
          marginBottom: 16,
          backgroundColor: '#5f6368',
        }}
      />

      <Between left="Ticket Price" right={fmtPrice(ticketPrice)} />
      <Between
        left="Guest Tickets"
        right={fmtPrice(guests.length * ticketPrice)}
      />
      <Between left="Promo Discount" right={fmtPrice(discount)} />
      <Between left="Donation" right={fmtPrice(donation)} />
      <Between
        style={{ fontWeight: 700 }}
        left="Total"
        right={fmtPrice(total)}
      />
    </Grid>
  )
}

const Details = () => (
  <React.Fragment>
    <h3 style={{ margin: 0, marginTop: 16 }}>Launch Party Details</h3>
    <div
      style={{
        height: 2,
        marginBottom: 16,
        backgroundColor: '#5f6368',
      }}
    />

    <div style={{ backgroundColor: '#efefef', padding: 16 }}>
      <Grid>
        <Grid.Row>
          <Icon name="clock" size={20} style={{color: '#5f6368' }} className="mr-6 mt-2" />
          <div className="">
            <span>Saturday, September 18, 2021</span>
            <span>8pm to 12am (BST)</span>
          </div>
        </Grid.Row>
        <div style={{ height: 16 }} />
        <Grid.Row>
          <Icon name="pin" size={20} style={{color: '#5f6368' }} className="mr-6" />
          44 Great Cumberland Pl, London W1H 7BS
        </Grid.Row>
      </Grid>
    </div>
  </React.Fragment>
)

export default ({ data }) => {
  return (
    <Layout title="Launch Party">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>You joined our launch party!</span>
      <Details />
      <Summary {...data} />

      <div
        style={{
          height: 2,
          marginTop: 8,
          marginBottom: 16,
          backgroundColor: '#5f6368',
        }}
      />

      <span>
        We are excited to meet you
        {data.donation && (
          <span className="mb-2">
            {' '}
            and thank you for your kind donation of{' '}
            <span style={{ fontWeight: 'bold' }}>£{data.donation}</span>
          </span>
        )}
        !
      </span>
    </Layout>
  )
}
