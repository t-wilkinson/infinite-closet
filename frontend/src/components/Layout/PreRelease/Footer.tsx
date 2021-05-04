import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import {
  Input,
  Submit,
  useFields,
  cleanFields,
  isValid,
} from '@/Accounts/components'
import { Icon, Divider } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const Footer = () => (
  <footer className="flex flex-col items-center justify-evenly w-full pb-2 my-4 md:flex-row">
    <div className="items-center flex-grow">
      <span className="text-2xl font-subheader">NEWSLETTER</span>
      <div className="content-center items-center rounded-sm">
        <Subscribe />
      </div>
    </div>
    <Divider className="my-4 md:hidden" />
    <FooterLinks />
    <Divider className="my-4 md:hidden" />
    <FollowUs />
  </footer>
)
export default Footer

type Status = 'None' | 'Error' | 'Submitted' | 'Submitting'

const Subscribe = () => {
  const [status, setStatus] = React.useState<Status>('None')
  const fields = useFields({
    newsletter_email: {
      constraints: 'required email',
      label: 'Email Address',
    },
  })

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/accounts/newsletter', {
        email: cleaned.newsletter_email,
      })
      .then(() => setStatus('Submitted'))
      .catch(() => setStatus('Error'))
  }

  const messages = {
    Submitted: (
      <div className="flex-row items-center content-center p-2 m-4">
        <span>Thanks for submitting!</span>
      </div>
    ),
    Submitting: (
      <div className="flex-row items-center content-center p-2 m-4">
        <span>Submitting...</span>
      </div>
    ),
  }

  return (
    <div className="relative p-2 pt-0">
      {status === 'Submitting' || status === 'Submitted' ? (
        <div className="absolute inset-0 bg-white z-20 items-center justify-center font-bold">
          {messages[status]}
        </div>
      ) : null}
      <Input {...fields.newsletter_email}>
        <div className="h-full absolute right-0 mr-2 justify-center">
          <Icon name="email" size={20} />
        </div>
      </Input>
      <Submit disabled={!isValid(fields)} onSubmit={() => onSubmit()}>
        Submit
      </Submit>
    </div>
  )
}

const FooterLinks = () => (
  <div className="items-center flex-grow">
    <FooterLink href="/" label="Landing Page" />
    <FooterLink href="/privacy-policy" label="Legal Terms and Conditions" />
  </div>
)

const FooterLink = ({ href, label }) => (
  <Link href={href}>
    <a>
      <span className="my-2 underline cursor-pointer">{label}</span>
    </a>
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
    <a aria-label={`Social media link to ${name}`}>
      <div className="p-5 border-gray border rounded-full cursor-pointer items-center justify-center">
        <Icon name={name} className="w-5 h-5" />
      </div>
    </a>
  </Link>
)
