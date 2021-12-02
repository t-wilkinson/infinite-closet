import React from 'react'
import axios from 'axios'

import useAnalytics from '@/utils/useAnalytics'
import useFields, { isError, cleanFields } from '@/Form/useFields'
import { FormHeader, Input, Checkbox } from '@/Form'
import { Button, BlueLink } from '@/components'

const howDidYouFindUs = [
  { label: 'Social Media', value: 'social-media' },
  { label: 'Word of Mouth', value: 'word-of-mouth' },
  { label: 'Search Engine (Google, etc.)', value: 'search-engine' },
  { label: 'Blog or Publication', value: 'blog' },
  { label: 'Other', value: 'other' },
]

type Status =
  | 'None'
  | 'ServerError'
  | 'ClientError'
  | 'Submitted'
  | 'Submitting'

const messages = {
  Submitting: <span className="font-bold text-2xl">Submitting...</span>,
  Submitted: (
    <span className="font-bold text-center text-2xl">
      Thank you for joining!
    </span>
  ),
}

const JoinWaitlist = () => {
  const [status, setStatus] = React.useState<Status>('None')

  return (
    <>
      <WaitlistForm status={status} setStatus={setStatus} />
      {status in messages ? (
        <div className="absolute inset-0 bg-white z-10 justify-center items-center border border-gray rounded-md">
          {messages[status]}
        </div>
      ) : null}
    </>
  )
}

const WaitlistForm = ({ status, setStatus }) => {
  const fields = useFields({
    firstName: { constraints: 'required' },
    lastName: { constraints: 'required' },
    checkbox: { constraints: 'required', label: '', default: 'other' },
    subscribe: { label: '' },
    email: { constraints: 'required email', label: 'Email Address' },
    comment: { label: 'Leave a comment' },
  })

  const analytics = useAnalytics()
  const onSubmit = () => {
    setStatus('Submitting')

    const cleaned = cleanFields(fields)
    const marketing = howDidYouFindUs.find(
      (v) => v.value == cleaned.checkbox
    )?.label

    axios
      .post('/account/waitlist', {
        ...cleaned,
        subscribe: cleaned.subscribe,
        marketing: marketing,
      })
      .then(() => {
        setStatus('Submitting')
        analytics.logEvent('form_submit', {
          type: 'waitlist',
          user: cleaned.email,
        })
      })
      .then(() => {
        window.localStorage.setItem('joined-waitlist', 'true')
        setStatus('Submitted')
      })
      .catch(() => setStatus('ServerError'))
  }

  return (
    <div className="items-center w-full">
      <FormHeader label="Join Our Waitlist" />
      <div className="w-full flex-row space-x-2">
        <Input {...fields.firstName} />
        <Input {...fields.lastName} />
      </div>
      <Input {...fields.email} />

      <div className="w-full my-2">
        <span className="my-2 font-bold">
          How did you first learn about our website?
        </span>
        <Checkboxes {...fields.checkbox} />
      </div>

      <Input {...fields.comment} />

      <div className="my-2 md:flex-row items-start">
        <Checkbox {...fields.subscribe}>
          <span>&nbsp;&nbsp;I want to subscribe to the newsletter.</span>
        </Checkbox>
      </div>
      <BlueLink href="/privacy" label="View terms" />

      <div className="my-2 w-full">
        <Button onClick={onSubmit} disabled={!isError(fields)}>
          <span>Join</span>
        </Button>
      </div>

      {status === 'ServerError' && (
        <div className="items-center">
          <span className="text-warning">
            Could not communicate with server. Try again?
          </span>
        </div>
      )}
      {status === 'ClientError' && (
        <div className="items-center">
          <span className="text-warning">Please fill out all fields.</span>
        </div>
      )}
    </div>
  )
}

const Checkboxes = ({ label, value, onChange }) => (
  <>
    {howDidYouFindUs.map((v) => (
      <Checkbox
        key={v.value}
        value={value === v.value}
        onChange={() => onChange(v.value)}
        label={label}
      >
        <span>&nbsp;&nbsp;{v.label}</span>
      </Checkbox>
    ))}
  </>
)

export default JoinWaitlist
