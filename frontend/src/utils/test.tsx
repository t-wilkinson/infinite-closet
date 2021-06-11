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
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }

export const createStore = (initialState = {}) =>
  configureStore({ ...storeOptions, preloadedState: initialState })

//   beforeEach(() => {
//     store = createStore()
//     store.dispatch = jest.fn()

//     component = renderer.create(
//       <Provider store={store}>
//         <ProductRentContents product={mockProduct} state={mockState} />
//       </Provider>,
//     )
//   })
