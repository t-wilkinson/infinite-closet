import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Icon, CallToAction, Divider } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const Footer = () => (
  <div className="flex-col items-center w-full pb-2 my-4 justify-evenly md:flex-row">
    <Subscribe />
    <Divider className="my-4 md:hidden" />
    <FooterLinks />
    <Divider className="my-4 md:hidden" />
    <FollowUs />
  </div>
)
export default Footer

type Status = 'None' | 'Error' | 'Submitted' | 'Submitting'

const Subscribe = () => {
  const [state, setState] = React.useState({
    status: 'None' as Status,
    focused: false,
    value: '',
  })

  const onSubmit = () => {
    fetch(process.env.GRAPHQL_API + '/accounts/newsletter', {
      method: 'POST',
      body: JSON.stringify({
        email: state.value,
      }),
    })
      .then(() => setState({ ...state, status: 'Submitted' }))
      .catch(() => setState({ ...state, status: 'Error' }))
      .then(() => {})
  }

  let content: React.ReactNode
  switch (state.status) {
    case 'Submitted':
      content = (
        <>
          <span className="text-2xl font-header">Newsletter</span>
          <div className="items-center justify-center px-2 my-2 border border-black">
            <div className="flex-row items-center justify-center p-2 m-4">
              <span>Thanks for submitting!</span>
            </div>
          </div>
        </>
      )
      break
    case 'Submitting':
      content = (
        <>
          <span className="text-2xl font-subheader">Newsletter</span>
          <div className="items-center justify-center px-2 my-2 border border-black">
            <div className="flex-row items-center justify-center p-2 m-4">
              <span>Submitting...</span>
            </div>
          </div>
        </>
      )
      break
    default:
      content = (
        <>
          <span className="text-2xl font-subheader">Newsletter</span>
          <div className="items-center px-2 my-2 border border-black">
            <div
              className={`flex-row items-center mt-4 p-2 border-b ${
                state.focused ? 'border-black' : 'border-gray-light'
              }`}
            >
              <Image src="/icons/email.svg" width={24} height={24} />
              <input
                placeholder="Email"
                value={state.value}
                onChange={(e) =>
                  setState((s) => ({ ...s, value: e.target.value }))
                }
                className="flex-grow p-1 outline-none placeholder-gray"
                onSubmit={() => onSubmit()}
                onBlur={() => setState((s) => ({ ...s, focused: false }))}
                onFocus={() => setState((s) => ({ ...s, focused: true }))}
              />
            </div>
            <div className="my-4">
              <CallToAction onClick={onSubmit}>Submit</CallToAction>
            </div>
          </div>
        </>
      )
      break
  }

  return <div className="items-center flex-grow">{content}</div>
}

const FooterLinks = () => (
  <div className="items-center flex-grow">
    <FooterLink href="/landing-page" label="Landing Page" />
    <FooterLink href="/privacy-policy" label="Legal Terms and Conditions" />
  </div>
)

const FooterLink = ({ href, label }) => (
  <Link href={href}>
    <span className="my-2 underline cursor-pointer">{label}</span>
  </Link>
)

export const FollowUs = ({ className = '' }) => (
  <div className={`items-center flex-grow ${className}`}>
    <span className="text-2xl font-subheader">Follow Us</span>
    <div className="flex-row my-4 width-full max-w-20 content-evenly space-x-2">
      <SocialMediaIcon name="facebook" />
      <SocialMediaIcon name="instagram" />
      <SocialMediaIcon name="twitter" />
      <SocialMediaIcon name="tiktok" />
    </div>
  </div>
)

export const SocialMediaIcon = ({ name }) => (
  <Link href={socialMediaLinks[name]}>
    <div className="p-5 border rounded-full cursor-pointer">
      <Icon name={name} className="w-5 h-5" />
    </div>
  </Link>
)
