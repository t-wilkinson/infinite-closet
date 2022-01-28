import React from 'react'
import { G, Footer } from '../layout'
import ReviewRequest from '../components/ReviewRequest'
import MailingList from '../components/MailingList'

export default () => {
  return (
    <G align="center">
      <G align="center" cellPadding={50}>
        <ReviewRequest />
        <Footer />
        <MailingList />
      </G>
    </G>
  )
}
