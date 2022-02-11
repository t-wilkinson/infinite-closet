import React from 'react'

import axios from '@/utils/axios'
import useAnalytics from '@/utils/useAnalytics'
import {
  useFields,
  Toggle,
  FormHeader,
  Input,
  Checkbox,
  Form,
  Submit,
} from '@/Form'
import { BlueLink } from '@/Components'

const howDidYouFindUs = [
  { label: 'Social Media', key: 'social-media' },
  { label: 'Word of Mouth', key: 'word-of-mouth' },
  { label: 'Search Engine (Google, etc.)', key: 'search-engine' },
  { label: 'Blog or Publication', key: 'blog' },
  { label: 'Other', key: 'other' },
]

const JoinWaitlist = () => {
  return <WaitlistForm />
}

const WaitlistForm = ({}) => {
  const fields = useFields({
    firstName: { constraints: 'required' },
    lastName: { constraints: 'required' },
    checkbox: { constraints: 'required', label: '', default: 'other' },
    subscribe: { label: '' },
    email: { constraints: 'required email', label: 'Email Address' },
    comment: { label: 'Leave a comment' },
  })

  const analytics = useAnalytics()
  const onSubmit = async () => {
    const cleaned = fields.clean()
    const marketing = howDidYouFindUs.find(
      (v) => v.key == cleaned.checkbox
    )?.label

    return axios
      .post<void>(
        '/account/waitlist',
        {
          ...cleaned,
          subscribe: cleaned.subscribe,
          marketing: marketing,
        },
        { withCredentials: false }
      )
      .then(() => {
        analytics.logEvent('form_submit', {
          type: 'waitlist',
          user: cleaned.email,
        })
        window.localStorage.setItem('joined-waitlist', 'true')
      })
  }

  return (
    <Form fields={fields} onSubmit={onSubmit}>
      <FormHeader label="Join Our Waitlist" />
      <div className="w-full flex-row space-x-2">
        <Input field={fields.get('firstName')} />
        <Input field={fields.get('lastName')} />
      </div>
      <Input field={fields.get('email')} />

      <div className="w-full my-2">
        <span className="my-2 font-bold">
          How did you first learn about our website?
        </span>
        <Toggle values={howDidYouFindUs} field={fields.get('checkbox')} />
      </div>

      <Input field={fields.get('comment')} />

      <div className="my-2 md:flex-row items-start">
        <Checkbox field={fields.get('subscribe')}>
          <span>&nbsp;&nbsp;I want to subscribe to the newsletter.</span>
        </Checkbox>
      </div>
      <BlueLink href="/privacy" label="View terms" />

      <Submit form={fields.form}>Join</Submit>
    </Form>
  )
}

export default JoinWaitlist
