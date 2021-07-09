import React from 'react'
import Layout from '../layout'
import Icon from '../elements/Icon'

const Var = ({ children }) => (
  <React.Fragment>
    {'{{ '}
    {children}
    {' }}'}
  </React.Fragment>
)

const TICKET_PRICE = 25

export const fetchData = () => {
  return []
}

const Summary = ({ discount, donation }) => {
  return (
    <React.Fragment>
      <h3 className="font-bold text-lg">Order Summary</h3>
      <div className="h-px w-full mb-4 bg-gray" />

      <div className="mb-2 w-full flex-row justify-between items-center">
        <span>Ticket Price</span>
        <span className="">£{TICKET_PRICE.toFixed(2)}</span>
      </div>

      <div className="mb-2 w-full flex-row justify-between items-center">
        <span>Promo Discount</span>
        <span>-£{discount.toFixed(2)}</span>
      </div>

      <div className="mb-2 w-full flex-row justify-between items-center">
        <span>Donation</span>
        <span>£{donation.toFixed(2)}</span>
      </div>

      <div className="mb-4 w-full flex-row justify-between items-center font-bold">
        <span className="">Total</span>
        <span className="">
          £{(donation + TICKET_PRICE - discount).toFixed(2)}
        </span>
      </div>
    </React.Fragment>
  )
}

const Details = () => (
  <React.Fragment>
    <h3 className="font-bold text-lg">Launch Party Details</h3>
    <div className="h-px w-full bg-gray" />
    <div className="w-full items-center">
      <div className="my-4 space-y-4 bg-gray-light w-96 p-4">
        <div className="flex-row">
          <Icon name="clock" size={20} className="text-gray mr-6 mt-2" />
          <div className="">
            <span>Saturday, August 7, 2021</span>
            <span>8pm to 12am (BST)</span>
          </div>
        </div>
        <span className="flex flex-row items-center">
          {/* TODO */}
          <Icon name="pin" size={20} className="text-gray mr-6" />
          44 Great Cumberland Pl, London W1H 7BS
        </span>
      </div>
    </div>
  </React.Fragment>
)

export const Email = ({ data }) => {
  return (
    <Layout title="Launch Party">
      <span className="font-bold text-xl">
        Hello <Var>name</Var>,
      </span>
      <span className="mb-2">You joined our launch party!</span>
      <Details />
      <Summary {...data} />

      <div className="h-px mb-4 w-full bg-gray" />
      <span>
        We are excited to meet you
        {data.donation && (
          <span className="mb-2">
            {' '}
            and thank you for your kind donation of{' '}
            <span className="font-bold">£{data.donation}</span>
          </span>
        )}
        !
      </span>
    </Layout>
  )
}
