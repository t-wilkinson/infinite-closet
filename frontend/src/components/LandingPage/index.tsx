import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import { Divider, Icon } from '@/components'
import { socialMediaLinks } from '@/utils/constants'
import useAnalytics from '@/utils/useAnalytics'
import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { Input, Checkbox, Submit } from '@/Form'

import { AboutUs } from './AboutUs'
import { howDidYouFindUs } from './constants'

export const LandingPage = () => {
  return (
    <div className="w-full mb-6">
      <div className="relative items-center min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{
            filter: 'blur(12px) brightness(0.5)',
            transform: 'scale(1.05)',
            backgroundImage: 'url(/images/brand/Facebook-Banner-shrunk.png)',
          }}
        />
        <div className="z-10 items-center w-full py-16 h-full px-4 sm:px-0">
          <div className="items-center w-full p-4 bg-white sm:my-92 sm:max-w-lg rounded-md">
            <span className="text-4xl uppercase font-subheader text-center">
              Join The Waitlist
            </span>
            <JoinWaitlist />
            <FooterContact />
          </div>
        </div>
      </div>

      <div className="items-center">
        <Divider className="mt-8 max-w-screen-xl" />
      </div>

      <AboutUs />
    </div>
  )
}

export default LandingPage

type Status =
  | 'None'
  | 'ServerError'
  | 'ClientError'
  | 'Submitted'
  | 'Submitting'

const JoinWaitlist = () => {
  const [status, setStatus] = React.useState<Status>('None')
  const messages = {
    Submitting: <span className="font-bold text-2xl">Submitting...</span>,
    Submitted: (
      <span className="font-bold text-center text-2xl">
        Thank you for joining!
      </span>
    ),
  }

  return (
    <div className="h-full w-full relative">
      <WaitlistForm status={status} setStatus={setStatus} />
      {status in messages ? (
        <div className="absolute inset-0 bg-white z-10 justify-center items-center border border-gray rounded-md">
          {messages[status]}
        </div>
      ) : null}
    </div>
  )
}

const WaitlistForm = ({ status, setStatus }) => {
  const fields = useFields({
    subscribe: { label: '' },
    checkbox: { constraints: 'required', label: '', defaultValue: 'other' },
    email: { constraints: 'required email', label: 'Email Address' },
    name: { constraints: 'required', label: 'Name' },
    comment: { label: 'Leave a comment' },
  })

  const app = useAnalytics()
  const onSubmit = () => {
    setStatus('Submitting')

    const cleaned = cleanFields(fields)
    const marketing = howDidYouFindUs.find((v) => v.value == cleaned.checkbox)
      ?.label

    axios
      .post('/accounts/waitlist', {
        ...cleaned,
        subscribe: cleaned.subscribe,
        marketing: marketing,
      })
      .then(() => {
        setStatus('Submitting')
        app.logEvent('form_submit', {
          type: 'waitlist',
          user: cleaned.email,
        })
      })
      .then(() => setStatus('Submitted'))
      .catch(() => setStatus('ServerError'))
  }

  return (
    <div className="items-center w-full my-4">
      <Input {...fields.name} />
      <Input {...fields.email} />

      <div className="w-full my-2">
        <span className="my-2 font-bold">
          How did you first learn about our website?
        </span>
        <Checkboxes {...fields.checkbox} />
      </div>

      <Input {...fields.comment} />

      <div className="items-center my-2 md:flex-row">
        <Checkbox {...fields.subscribe}>
          <span>&nbsp;&nbsp;I want to subscribe to the newsletter.</span>
        </Checkbox>
      </div>
      <Link href="/privacy-policy">
        <a>
          <span className="underline cursor-pointer">View terms</span>
        </a>
      </Link>

      <div className="my-2">
        <Submit onSubmit={onSubmit} disabled={!isValid(fields)}>
          <span>Join</span>
        </Submit>
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

const FooterContact = () => (
  <div className="flex-row items-center justify-between w-full">
    <div>
      <span className="text-gray">London, UK</span>
      <Link href="mailto:info@infinitecloset.co.uk">
        <a>
          <span className="text-gray-dark">info@infinitecloset.co.uk</span>
        </a>
      </Link>
    </div>
    <div className="flex-row items-center">
      <div className="items-center md:flex-row">
        <SocialMediaIcon name="facebook" />
        <div className="mt-2 md:mt-0">
          <SocialMediaIcon name="instagram" />
        </div>
      </div>
      <div className="items-center md:flex-row">
        <SocialMediaIcon name="twitter" />
        <div className="mt-2 md:mt-0">
          <SocialMediaIcon name="tiktok" />
        </div>
      </div>
    </div>
  </div>
)

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

const SocialMediaIcon = ({ name }) => (
  <Link href={socialMediaLinks[name]}>
    <a aria-label={`Social media link to ${name}`} className="mx-2">
      <Icon name={name} className="w-6 h-6 text-black" />
    </a>
  </Link>
)
