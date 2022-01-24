import React from 'react'

export default ({ data }) => {
  const { user, cartItem } = data

  return (
    <React.Fragment>
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
      {`{
"recipientName": "${user.firstName} ${user.lastName}",
"recipientEmail": "${user.email}",
"referenceId": "${cartItem.order.id}"
}`}

    </React.Fragment>
  )
}
