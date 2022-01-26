import React from 'react'

export default ({ data }) => {
  const { firstName, lastName, email, message, phoneNumber } = data
  return (
    <dl>
      <dt>First Name</dt>
      <dd>{firstName}</dd>
      <dt>Last Name</dt>
      <dd>{lastName}</dd>
      <dt>Email Address</dt>
      <dd>{email}</dd>
      <dt>Phone Number</dt>
      <dd>{phoneNumber}</dd>
      <dt>Message</dt>
      <dd>{message}</dd>
    </dl>
  )
}
