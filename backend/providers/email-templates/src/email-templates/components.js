import React from 'react'
import { G, Footer } from '../layout'
import ReviewRequest from '../components/ReviewRequest'
import MailingList from '../components/MailingList'

export default () => {
  return (
    <G align="center" width="100%">
      <center>
        <G width="700" cellPadding={50}>
          <ReviewRequest />
          <Footer />
          <MailingList />
        </G>
      </center>
    </G>
  )
}
