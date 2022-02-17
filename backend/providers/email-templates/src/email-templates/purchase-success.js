import React from 'react'

import { P, Layout } from '../layout'
import {
  Heading,
  Space,
  Separator,
} from '../components'

export default ({ data }) => {
  const { firstName } = data
  return (
    <Layout
      title="Purchase success"
    >
      <Space n={1} />

      <Separator />
      <P>
        <p>Hello {firstName},</p>
      </P>

      <Space n={5} />
      <Heading>Thank you for your purchase!</Heading>
      <Space n={5} />

    </Layout>
  )
}

