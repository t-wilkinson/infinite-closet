import React from 'react'
import Layout from '../layout'

export default ({ data }) => {
  const {
    order: { user },
  } = data

  return (
    <Layout title="Trustpilot">
      <script
        type="application/json+trustpilot"
        dangerouslySetInnerHTML={{
          __html: `
{
"recipientName": "${user.firstName} ${user.lastName}",
"recipientEmail": "${user.email}",
"referenceId": "${data.order.id}"
}
        `,
        }}
      />
    </Layout>
  )
}

