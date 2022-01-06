import React from 'react'

export default ({ data }) => {
  const { user, cartItem } = data

  return (
    <script
      type="application/json+trustpilot"
      dangerouslySetInnerHTML={{
        __html: `
{
"recipientName": "${user.firstName} ${user.lastName}",
"recipientEmail": "${user.email}",
"referenceId": "${cartItem.order.id}"
}
        `,
      }}
    />
  )
}
