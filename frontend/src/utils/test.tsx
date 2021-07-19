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
  } = {},
) {
  store.dispatch = jest.fn()

  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }

  let component = rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
  component.store = store
  return component
}

export const api = 'http://localhost'
export const Url = (url: string) => {
  url = url.replace(/:number/, '\\d+')
  url = url.replace(/:id/, '\\d+')
  url = url.replace(/:string/, '\\w+')
  return new RegExp(url)
}

export * from '@testing-library/react'
export { render }
