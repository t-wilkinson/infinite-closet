import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

import useFields, { cleanFields } from '@/Form/useFields'
import { Input } from '@/Form'
import { Button, Icon } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const Footer = () => {
  return (
    <FooterWrapper>
      <nav className="flex flex-wrap flex-row items-start justify-start md:justify-center">
        <Section
          title="Get Help"
          links={[
            { href: '/#how-it-works', label: 'How it Works' },
            { href: '/faqs', label: 'FAQs' },
            { href: '/contact-us', label: 'Contact Us' },
            // { href: '/size-charts', label: 'Size Charts' },
          ]}
        />
        <Section
          title="Company"
          links={[{ href: '/about-us', label: 'About Us' }]}
        />

        <Section
          title="Legal"
          links={[
            {
              href: '/terms-and-conditions',
              label: 'Terms & Conditions',
            },
            { href: '/privacy', label: 'Privacy & Cookie Policy' },
          ]}
        />

        <div className="space-y-4">
          {/* <Section title="Rent On The Go"> */}
          {/*   <DownloadPWA /> */}
          {/* </Section> */}
          <Section title="Stay Connected">
            <Waitlist />
            <FollowUs />
          </Section>
        </div>
      </nav>
    </FooterWrapper>
  )
}

const FooterWrapper = ({ children }) => (
  <div className="items-center w-full px-2 bg-sec text-white">
    <footer className="flex flex-col w-full p-16 max-w-screen-lg">
      {children}
    </footer>
    <div className="mb-8">
      <small>© 2021 Infinite Closet. All Rights Reserved.</small>
    </div>
  </div>
)

const Section = ({ title, links = [], children = null }) => (
  <div className="mx-4 my-4 items-start">
    <strong className="mb-3">{title}</strong>
    <div className="leading-8 text-sm">
      {links.map((link) => (
        <FooterLink key={link.label} {...link} />
      ))}
    </div>
    {children}
  </div>
)

const DownloadPWA = () => {
  // Setup pwa download button
  React.useEffect(() => {
    let deferredPrompt
    const addBtn = document.querySelector('.add-button')
    addBtn.style.display = 'none'

    const beforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      deferredPrompt = e
      // Update UI to notify the user they can add to home screen
      addBtn.style.display = 'block'

      addBtn.addEventListener('click', (e) => {
        // hide our user interface that shows our A2HS button
        addBtn.style.display = 'none'
        // Show the prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            // 'User accepted the A2HS prompt'
          } else {
            // 'User dismissed the A2HS prompt'
          }
          deferredPrompt = null
        })
      })
    }

    window.addEventListener('beforeinstallprompt', beforeInstallPrompt)
    return () =>
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt)
  }, [])

  return (
    <div className="flex-row items-start">
      <Image src="/icons/phone.svg" height={48} width={32} />
      <div className="w-2" />
      <button className="underline inline text-sm add-button">Download</button>
    </div>
  )
}

const FooterLink = ({ href, label }) => (
  <Link href={href}>
    <a>
      <span className="my-2 cursor-pointer">{label}</span>
    </a>
  </Link>
)

type Status = 'None' | 'Error' | 'Submitted' | 'Submitting'

const Waitlist = () => {
  const [status, setStatus] = React.useState<Status>('None')
  const fields = useFields({
    email: {
      constraints: 'email',
      label: 'Email Address',
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const cleaned = cleanFields(fields)
    axios
      .post('/account/mailinglist', {
        email: cleaned.email,
      })
      .then(() => setStatus('Submitted'))
      .catch(() => {
        setStatus('Error')
      })
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
    <form
      className="w-full flex flex-col items-stretch relative text-sm"
      onSubmit={onSubmit}
    >
      {status === 'Submitting' || status === 'Submitted' ? (
        <div className="absolute inset-0 bg-white z-20 items-center justify-center font-bold rounded-sm border border-gray">
          {messages[status]}
        </div>
      ) : status === 'Error' ? (
        <div className="text-warning">
          Couldn't send you an email. Try again?
        </div>
      ) : null}
      <div className="flex-row space-x-4 w-full">
        <Input {...fields.email} after={<Button className="">Join</Button>} />
      </div>
      <h3 className="font-bold text-sm -mt-1 mb-5">
        Get 10% off your first rental
      </h3>
    </form>
  )
}

export const FollowUs = () => (
  <div className="flex-row width-full max-w-20 content-evenly space-x-3">
    <SocialMediaIcon name="facebook" />
    <SocialMediaIcon name="instagram" />
    <SocialMediaIcon name="twitter" />
    <SocialMediaIcon name="tiktok" />
  </div>
)

export const SocialMediaIcon = ({ name }) => (
  <Link href={socialMediaLinks[name]}>
    <a aria-label={`Social media link to ${name}`}>
      <div className="rounded-full cursor-pointer items-center justify-center">
        <Icon name={name} className="w-6 h-6" />
      </div>
    </a>
  </Link>
)

export default Footer
