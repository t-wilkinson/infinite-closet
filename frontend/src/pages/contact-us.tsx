import React from 'react'
import axios from 'axios'

import { MarkdownWrapper, fetchMarkdown } from '@/Markdown'
import useFields, { cleanFields, isValid } from '@/Form/useFields'
import { Button } from '@/components'
import { Input } from '@/Form'

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
    axios
      .post('/chat/contact', cleaned)
      .then(() => setStatus('success'))
      .catch((err) => console.error(err))
  }

  return (
    <MarkdownWrapper {...data}>
      <form className="w-full relative" onSubmit={(e) => e.preventDefault()}>
        <div className="w-full relative items-stretch">
          {status === 'success' ? (
            <div className="absolute inset-0 bg-white border border-gray z-20 justify-center items-center">
              <span className="text-lg font-bold">
                We have recieved your request.
              </span>
            </div>
          ) : null}
          {Object.values(fields).map((field) => (
            <Input key={field.field} {...field} />
          ))}
          <Button disabled={!isValid(fields)} onClick={sendMessage}>
            Contact Us
          </Button>
        </div>
      </form>
    </MarkdownWrapper>
  )
}

export const getServerSideProps = fetchMarkdown({})
export default Page
