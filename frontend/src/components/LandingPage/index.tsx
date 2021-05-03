import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'

import { Divider, Icon } from '@/components'
import { socialMediaLinks } from '@/utils/constants'
import useAnalytics from '@/utils/useAnalytics'
import {
  Input,
  useFields,
  isValid,
  cleanFields,
  Checkbox,
  Submit,
  // validateField,
  // Warning,
} from '@/Accounts/components'

import { AboutUs } from './AboutUs'
import { howDidYouFindUs } from './constants'

export const LandingPage = () => {
  return (
    <div className="w-full mb-6">
      <div className="relative items-center h-screen">
        <Image
          src="/images/brand/Facebook-Banner.png"
          layout="fill"
          objectFit="cover"
        />
        <div className="z-10 items-center w-full py-16 bg-black h-full bg-opacity-50 px-4 sm:px-0">
          <div className="items-center w-full p-4 bg-white sm:my-92 sm:max-w-lg sm:rounded-md">
            <JoinWaitlist />
          </div>
        </div>
      </div>
      <div className="items-center">
        <Divider className="mt-8 max-w-screen-xl" />
      </div>

      <AboutUs />
      <div className="mb-4" />
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

  if (status === 'Submitting') {
    return (
      <div className="items-center content-center w-full">
        <span className="font-subheader">Submitting</span>
      </div>
    )
  } else if (status === 'Submitted') {
    return (
      <div className="items-center content-center w-full">
        <span>Form was successfully submitted.</span>
        <span className="font-subheader">Thank You!</span>
      </div>
    )
  } else {
    return (
      <div className="w-full">
        <WaitlistForm status={status} setStatus={setStatus} />
      </div>
    )
  }
}

const WaitlistForm = ({ status, setStatus }) => {
  const fields = useFields({
    subscribe: { label: '' },
    checkbox: { constraints: 'required', label: '' },
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
        data: {
          ...cleaned,
          subscribe: cleaned.subscribe,
          marketing: marketing,
        },
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
    <div className="w-full">
      <div className="z-10 items-center w-full my-4">
        <span className="text-4xl uppercase text-pri font-subheader text-center">
          Join The Waitlist
        </span>

        <Input {...fields.name} />
        <Input {...fields.email} />

        <div className="w-full my-2">
          <span className="my-2 font-bold">
            How did you first learn about our website?
          </span>
          <Checkboxes {...fields.checkbox} />
          {/* <Warning>{validateField(fields.checkbox)}</Warning> */}
        </div>

        <Input {...fields.comment} />

        <div className="items-center my-2 md:flex-row">
          <Checkbox {...fields.subscribe}>
            <span>&nbsp;&nbsp;I want to subscribe to the newsletter.</span>
          </Checkbox>
          &nbsp;
        </div>
        <Link href="/privacy-policy">
          <span className="underline cursor-pointer">View terms.</span>
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

      <FooterContact />
    </div>
  )
}

const FooterContact = () => (
  <div className="flex-row items-center justify-between w-full">
    <div>
      <span className="text-gray-dark">London, UK</span>
      <span className="text-gray-dark">info@infinitecloset.co.uk</span>
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
    <div className="mx-2 cursor-pointer">
      <Icon name={name} className="w-6 h-6 text-black" />
    </div>
  </Link>
)
