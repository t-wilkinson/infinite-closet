import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Divider, Icon, CallToAction, CheckBox } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

import { AboutUs } from './AboutUs'
import { howDidYouFindUs } from './constants'

export const LandingPage = () => {
  return (
    <div className="w-full mb-6">
      <div className="relative items-center">
        <Image
          src="/images/brand/Facebook-Banner.png"
          layout="fill"
          objectFit="cover"
        />
        <div className="z-10 items-center w-full py-16 bg-black bg-opacity-50">
          <div className="items-center w-full p-4 bg-white md:my-92 md:max-w-lg bg-opacity-75">
            <JoinWaitlist />
          </div>
        </div>
      </div>
      <Divider className="mt-8" />
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

// TODO use useReducer instead
const JoinWaitlist = () => {
  const [status, setStatus] = React.useState<Status>('None')

  if (status === 'Submitting') {
    return (
      <div className="items-center content-center">
        <span className="font-subheader">Submitting</span>
      </div>
    )
  } else if (status === 'Submitted') {
    return (
      <div className="items-center content-center">
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
  const [state, setState] = React.useState({
    subscribe: { value: false },
    checkbox: { value: null },
    email: { placeholder: 'Email', value: '' },
    name: { placeholder: 'Name', value: '' },
    other: { placeholder: 'Leave a comment', value: '' },
  })

  const getProps = (field: string) => ({
    state: state[field],
    setState: (value: any) =>
      setState((s) => {
        const newState = { ...s }
        newState[field].value = value
        return newState
      }),
  })

  const subscribe = getProps('subscribe')
  const checkbox = getProps('checkbox')

  const onSubmit = () => {
    setStatus('Submitting')

    const marketing = howDidYouFindUs.find(
      (v) => v.value == state.checkbox.value,
    )?.label
    const body = {
      name: state.name.value.trim(),
      email: state.email.value.trim(),
      comment: state.other.value.trim(),
    }

    if (body.name.length === 0 || body.email.length === 0) {
      setStatus('ClientError')
      return
    }

    fetch(process.env.GRAPHQL_API + '/accounts/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        subscribe: state.subscribe.value,
        marketing: marketing,
      }),
    })
      .then(() => {
        setStatus('Submitting')
        // Analytics.logEvent('form_submit', {
        //   route: '/landing-page',
        //   type: 'waitlist',
        //   id: body.email,
        // })
      })
      .then(() => setStatus('Submitted'))
      .catch(() => setStatus('ServerError'))
      .then(() => {})
  }

  return (
    <div className="w-full">
      <div className="z-10 items-center w-full my-4">
        <span className="text-4xl uppercase text-pri font-subheader">
          Join The Waitlist
        </span>
        <WaitlistItem>
          <span className="font-bold">Name</span>
          <Input
            autoComplete="name"
            autoCapitalize="words"
            {...getProps('name')}
          />
        </WaitlistItem>

        <WaitlistItem>
          <span className="text-bold">Email</span>
          <Input
            autoComplete="email"
            autoCapitalize="none"
            {...getProps('email')}
          />
        </WaitlistItem>

        <WaitlistItem>
          <span className="my-2 font-bold">
            How did you first learn about our website?
          </span>
          <CheckBoxes {...checkbox} />
          <Input {...getProps('other')} />
        </WaitlistItem>

        <div className="items-center my-2 md:flex-row">
          <CheckBox state={subscribe.state.value} setState={subscribe.setState}>
            <span>
              &nbsp;&nbsp;I want to subscribe to the newsletter.&nbsp;
            </span>
          </CheckBox>
          <Link href="/privacy-policy">
            <span className="underline">View terms.</span>
          </Link>
        </div>

        <div className="my-2">
          <CallToAction onClick={onSubmit}>
            <span>Join</span>
          </CallToAction>
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

const CheckBoxes = ({ state, setState }) => (
  <>
    {howDidYouFindUs.map((v) => (
      <CheckBox
        key={v.value}
        state={state.value === v.value}
        setState={(s: null | string) => s && setState(v.value)}
        my="xs"
      >
        <span>&nbsp;&nbsp;{v.label}</span>
      </CheckBox>
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

const Input = ({ state, setState, ...props }) => {
  const [focused, setFocused] = React.useState(false)

  return (
    <div
      className={`border-b-2 flex-row items-center w-full my-2 ${
        focused ? 'border-sec-light' : 'border-gray-dark'
      }`}
    >
      <input
        className="flex-grow p-1 bg-transparent outline-none placeholder-gray-dark"
        placeholder={state.placeholder}
        spellCheck="false"
        enterKeyHint="next"
        {...props}
        value={state.value}
        onChange={(text) => setState(text)}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
      />
    </div>
  )
}

const WaitlistItem = (props: object) => (
  <div className="w-full my-2" {...props} />
)
