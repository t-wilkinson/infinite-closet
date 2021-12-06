import React from 'react'
import axios from 'axios'

import { MarkdownWrapper, fetchMarkdown } from '@/Markdown'
import { useFields, Form, Input, Submit } from '@/Form/index_'

export const Page = ({ data }) => {
  const fields = useFields({
    name: { constraints: 'required' },
    emailAddress: { constraints: 'required email' },
    phoneNumber: { constraints: 'phone' },
    message: { constraints: 'required' },
  })

  const sendMessage = async () => {
    const cleaned = fields.clean()
    return axios.post('/chat/contact', cleaned).catch(() => {
      throw 'Unable to send your message, please try again later.'
    })
  }

  const Success = () => (
    <div className="absolute inset-0 bg-white border border-gray z-20 justify-center items-center">
      <span className="text-lg font-bold">We have recieved your request.</span>
    </div>
  )

  return (
    <MarkdownWrapper {...data}>
      <Form
        fields={fields}
        className="w-full relative"
        onSubmit={sendMessage}
        Success={Success}
      >
        <div className="w-full relative items-stretch">
          {Object.values(fields.fields).map((field) => (
            <Input key={field.name} field={field} />
          ))}
          <Submit field={fields.form}>Contact Us</Submit>
        </div>
      </Form>
    </MarkdownWrapper>
  )
}

export const getServerSideProps = fetchMarkdown({})
export default Page
