import React from 'react'
import Link from 'next/link'
import axios from 'axios'

import useFields, { isValid, cleanFields } from '@/Form/useFields'
import { Input, Submit } from '@/Form'
import { Icon, Divider } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const Footer = () => (
  <>
    <Divider />
    <div className="items-center w-full px-2">
      <footer className="flex flex-col items-center justify-between w-full pb-2 my-4 md:flex-row max-w-screen-xl">
        <div className="items-center">
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
    </div>
  </>
)
export default Footer

type Status = 'None' | 'Error' | 'Submitted' | 'Submitting'

const Subscribe = () => {
  const [status, setStatus] = React.useState<Status>('None')
  const fields = useFields({
    newsletterEmail: {
      constraints: 'required email',
      label: 'Email Address',
    },
  })

  const onSubmit = () => {
    const cleaned = cleanFields(fields)
    axios
      .post('/account/newsletter', {
        email: cleaned.newsletterEmail,
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
    <div className="relative m-2 pt-0">
      {status === 'Submitting' || status === 'Submitted' ? (
        <div className="absolute inset-0 bg-white z-20 items-center justify-center font-bold rounded-sm border border-gray">
          {messages[status]}
        </div>
      ) : null}
      <Input {...fields.newsletterEmail}>
        <div className="mr-2 justify-center">
          <Icon name="email" size={20} />
        </div>
      </Input>
      <Submit disabled={!isValid(fields)} onSubmit={() => onSubmit()}>
        Submit
      </Submit>
    </div>
  )
}

const footerLinks = [
  { href: '/legal/terms-and-conditions', label: 'Legal Terms & Conditions' },
  { href: '/legal/privacy-policy', label: 'Privacy & Cookie Policy' },
]

const FooterLinks = () => (
  <div className="items-center flex-row">
    <div className="w-full items-center">
      {footerLinks.map((link) => (
        <FooterLink key={link.label} {...link} />
      ))}
    </div>
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
  <div className={`items-center ${className}`}>
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
