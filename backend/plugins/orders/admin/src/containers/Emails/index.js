/**
 * @file Enable admin to send emails that are normally hidden behind rest api
 */
import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Label, InputNumber, Button } from 'strapi-helper-plugin'
import styled from 'styled-components'

import Wrapper from './Wrapper'
import pluginId from '../../pluginId'
import { emails } from '../../config'

const Emails = () => {
  // const location = useLocation();
  // const path = location.pathname.split("/").slice(-1)
  const path = (subpath) => `/plugins/${pluginId}/emails/${subpath}`
  const giftCardEmail = emails.find(email => email.slug === 'gift-card')

  return (
    <Wrapper>
      <Switch>
        {emails.map((email) => (
          email.type === 'order' &&
          <Route
            path={path(email.slug)}
            component={() => <RentalEmail slug={email.route} />}
          />
        ))}
        {<Route
            path={path(giftCardEmail.slug)}
          component={() => <GiftCardEmail slug={giftCardEmail.route} />}
        />
        }
      </Switch>
    </Wrapper>
  )
}

const RentalEmail = ({ slug }) => {
  const [orderId, setOrderId] = React.useState()
  const [status, setStatus] = React.useState({ code: null, message: null })

  const onSubmit = (e) => {
    e.preventDefault()
    setStatus({ code: 'loading', message: 'Loading...' })

    fetch(`${strapi.backendURL}/emails/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message)
        } else {
          setStatus({ code: 'success', message: 'Successfully sent mail' })
        }
      })
      .catch((err) => {
        setStatus({
          code: 'error',
          message: `Failure sending mail\n${err.message}`,
        })
        console.error(err)
      })
  }

  return (
    <RentalEndingWrapper>
      <div>
        <form onSubmit={onSubmit}>
          <fieldset>
            <Label message="Order id"></Label>
            <InputNumber
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              name="order-id"
            />
          </fieldset>
          <Button style={{ marginTop: '1rem' }} type="submit" primary={true}>
            Send email
          </Button>
        </form>
        {status.code === 'success' ? (
          <span>{status.message}</span>
        ) : status.code === 'loading' ? (
          <span>{status.message}</span>
        ) : status.code === 'error' ? (
          <span style={{ color: 'red' }}>{status.message}</span>
        ) : null}
      </div>
    </RentalEndingWrapper>
  )
}

const GiftCardEmail = ({ slug }) => {
  const [firstName, setFirstName] = React.useState()
  const [giftCardId, setGiftCardId] = React.useState()
  const [status, setStatus] = React.useState({ code: null, message: null })

  const onSubmit = (e) => {
    e.preventDefault()
    setStatus({ code: 'loading', message: 'Loading...' })

    fetch(`${strapi.backendURL}/emails/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        giftCardId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message)
        } else {
          setStatus({ code: 'success', message: 'Successfully sent mail' })
        }
      })
      .catch((err) => {
        setStatus({
          code: 'error',
          message: `Failure sending mail\n${err.message}`,
        })
        console.error(err)
      })
  }

  return (
    <RentalEndingWrapper>
      <div>
        <form onSubmit={onSubmit}>
          <fieldset>
            <Label message="First name" />
            <InputNumber
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              name="first-name"
            />
          </fieldset>
          <fieldset>
            <Label message="Gift Card Id" />
            <InputNumber
              value={giftCardId}
              onChange={(e) => setGiftCardId(e.target.value)}
              name="gift-card-id"
            />
          </fieldset>
          <Button style={{ marginTop: '1rem' }} type="submit" primary={true}>
            Send email
          </Button>
        </form>
        {status.code === 'success' ? (
          <span>{status.message}</span>
        ) : status.code === 'loading' ? (
          <span>{status.message}</span>
        ) : status.code === 'error' ? (
          <span style={{ color: 'red' }}>{status.message}</span>
        ) : null}
      </div>
    </RentalEndingWrapper>
  )
}

const RentalEndingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export default Emails
