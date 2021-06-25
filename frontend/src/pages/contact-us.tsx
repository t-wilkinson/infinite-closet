import React from 'react'
import axios from 'axios'

import { MarkdownWrapper, fetchMarkdown } from '@/Markdown'
import useFields, { cleanFields, isValid } from '@/Form/useFields'
import { Submit, Input } from '@/Form'

type Status = 'progress' | 'processing' | 'success' | 'error'

export const Page = ({ data }) => {
  const [status, setStatus] = React.useState<Status>('progress')

  const fields = useFields({
    firstName: { constraints: 'required' },
    lastName: { constraints: 'required' },
    emailAddress: { constraints: 'required email' },
    phoneNumber: { constraints: 'phone' },
    message: { constraints: 'required' },
  })

  const sendMessage = () => {
    const cleaned = cleanFields(fields)

    // axios.post('/chat/contact', cleaned)
  }

  return (
    <MarkdownWrapper {...data}>
      <div className="max-w-screen-sm w-full">
        {Object.values(fields).map((field) => (
          <Input key={field.field} {...field} />
        ))}
        <Submit
          className="w-full"
          disabled={!isValid(fields)}
          onSubmit={sendMessage}
        >
          Coming sooon...
        </Submit>
      </div>
    </MarkdownWrapper>
  )
}

export const getServerSideProps = fetchMarkdown({})
export default Page
