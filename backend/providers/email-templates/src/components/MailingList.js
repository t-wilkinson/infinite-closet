import React from 'react'

import { Container } from '../layout'

export const MailingList = () => {
  return (
    <React.Fragment>
      <Container title="Get In The Know" href="" button="Subscribe now">
        <span className="text-center">
          Haven’t joined out mailing list? It’s not too late! Be the first to
          know about new arrivals, exclusive offers, & perks!
        </span>
      </Container>
      <br />
    </React.Fragment>
  )
}

export default MailingList
