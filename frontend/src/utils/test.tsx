import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { storeOptions } from '@/utils/store'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'

function render(
  ui: React.ReactElement<any>,
  {
    initialState = {},
    store = configureStore({ ...storeOptions, preloadedState: initialState }),
    ...renderOptions
  } = {}
) {
  store.dispatch = jest.fn()

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  let component = rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
  // @ts-ignore
  component.store = store
  return component
}

export const api = 'http://localhost'
export const Url = (url: string, params: object = {}) => {
  const urlParams = url.match(/:\w+/g)
  if (urlParams) {
    url = urlParams.reduce((url, param) => {
      const value = params[param.slice(1)]
      if (value) {
        return url.replace(new RegExp(param), value)
      } else {
        return url
      }
    }, url)
  }

  url = url.replace(/:number/, '\\d+')
  url = url.replace(/:id/, '\\d+')
  url = url.replace(/:string/, '\\w+')

  return new RegExp(url)
}

// beforeAll((done) => {
//   global.t = {}
//   done()
// })

import userEvent from '@testing-library/user-event'
export * from '@testing-library/react'
export { userEvent, render }
