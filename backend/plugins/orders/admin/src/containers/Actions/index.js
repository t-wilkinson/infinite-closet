import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Label, InputNumber, Button } from 'strapi-helper-plugin'
import styled from 'styled-components'

import pluginId from '../../pluginId'

const Actions = () => {
  const path = (subpath) => `/plugins/${pluginId}/actions/${subpath}`

  return <Switch>
    <Route
      path={path('ship')}
      component={() => <Ship slug="ship" />}
    />
  </Switch>
}

const Ship = ({slug}) => {
const [orderId, setOrderId] = React.useState()
  const [status, setStatus] = React.useState({ code: null, message: null })

  const onSubmit = (e) => {
    e.preventDefault()
    setStatus({ code: 'loading', message: 'Loading...' })

    fetch(`${strapi.backendURL}/orders/actions/${slug}`, {
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
          throw res
        } else {
          setStatus({ code: 'success', message: 'Successfully executed' })
        }
      })
      .catch(async (err) => {
        let message
        try {
          message = (await err.json()).message
        } catch (e) {
          message = err.statusText
        }
        setStatus({
          code: 'error',
          message: `Failure with action\n${message}`,
        })
      })
  }

  return <div>
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
        Send action
      </Button>
    </form>
    {status.code === 'success' ? (
      <span>{status.message}</span>
    ) : status.code === 'loading' ? (
      <span>{status.message}</span>
    ) : status.code === 'error' ? (
      <span style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
        {status.message}
      </span>
    ) : null}
  </div>
}

export default Actions
