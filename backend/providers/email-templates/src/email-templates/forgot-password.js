import React from 'react'
import { P, Legal, Layout, G } from '../layout'
import { ButtonLink } from '../components'

export default ({ data }) => {
  const { url, user } = data
  return (
    <Layout
      title="Requested Password Reset"
      footer={false}
      img="/media/photoshoot/blue-dress-mirror.png"
    >
      <G cellPadding={8}>
        <P>
          <p>Hello {user.firstName},</p>
          <p>
            You have requested a password reset for your account. If this was
            not you, please ignore this email.
          </p>
          <p>Use the link below to reset your password.</p>
        </P>
        <G style={{ textAlign: 'center' }} cellPadding={48}>
          <ButtonLink href={url}>Reset Password</ButtonLink>
        </G>
      </G>
      <Legal color="#5f6368" style={{ fontSize: 14 }}/>
    </Layout>
  )
}
