import React from 'react'

import Grid from './Grid'
import Footer from '../elements/Footer'

export const Layout = ({ title, children }) => (
  <div className="bg-gray-light py-4 w-full items-center">
    <Grid className="w-full max-w-screen-sm">
      <div className="items-end flex-row justify-between mt-4 mb-8">
        <h1 className="font-header text-xl">INFINITE CLOSET</h1>
        <span className="text-xl font-body">{title}</span>
      </div>
      <Grid>
        <Grid.Cell>
          <div className="bg-white p-4">{children}</div>
        </Grid.Cell>
      </Grid>
      <Footer />
    </Grid>
  </div>
)
export default Layout
