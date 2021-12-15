import React from 'react'
import Link from 'next/link'

import axios from '@/utils/axios'
import { useFields, Form, Input, Submit, } from '@/Form'
import { Icon } from '@/components'
import { socialMediaLinks } from '@/utils/config'
import { iconInstagram } from '@/components/Icons'
import { iconFacebook } from '@/components/Icons'
import { iconTwitter } from '@/components/Icons'
import { iconTiktok } from '@/components/Icons'

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
    <footer className="flex flex-col w-full p-8 sm:p-16 max-w-screen-lg">
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

// const DownloadPWA = () => {
//   // Setup pwa download button
//   React.useEffect(() => {
//     let deferredPrompt
//     const addBtn = document.querySelector('.add-button')
//     addBtn.style.display = 'none'

//     const beforeInstallPrompt = (e) => {
//       // Prevent Chrome 67 and earlier from automatically showing the prompt
//       e.preventDefault()
//       // Stash the event so it can be triggered later.
//       deferredPrompt = e
//       // Update UI to notify the user they can add to home screen
//       addBtn.style.display = 'block'

//       addBtn.addEventListener('click', (e) => {
//         // hide our user interface that shows our A2HS button
//         addBtn.style.display = 'none'
//         // Show the prompt
//         deferredPrompt.prompt()
//         // Wait for the user to respond to the prompt
//         deferredPrompt.userChoice.then((choiceResult) => {
//           if (choiceResult.outcome === 'accepted') {
//             // 'User accepted the A2HS prompt'
//           } else {
//             // 'User dismissed the A2HS prompt'
//           }
//           deferredPrompt = null
//         })
//       })
//     }

//     window.addEventListener('beforeinstallprompt', beforeInstallPrompt)
//     return () =>
//       window.removeEventListener('beforeinstallprompt', beforeInstallPrompt)
//   }, [])

//   return (
//     <div className="flex-row items-start">
//       <Image src="/icons/phone.svg" height={48} width={32} />
//       <div className="w-2" />
//       <button className="underline inline text-sm add-button">Download</button>
//     </div>
//   )
// }

const FooterLink = ({ href, label }) => (
  <Link href={href} prefetch={false}>
    <a>
      <span className="my-2 cursor-pointer">{label}</span>
    </a>
  </Link>
)

const Waitlist = () => {
  const fields = useFields({
    footerEmail: {
      constraints: 'email',
      label: 'Email Address',
      autocomplete: 'email',
    },
  })

  const onSubmit = async () => {
    const cleaned = fields.clean()
    return axios
      .post<void>('/account/mailing-list', {
        email: cleaned.footerEmail,
      }, {withCredentials: false})
      .catch(() => {
        fields.form.setErrors('Couldn\'t send you an email. Try again?')
      })
  }

  const Success = () => <span className="text-base">Thanks for submitting!</span>

  return (
    <Form
      className="w-full flex flex-col items-stretch relative text-sm text-black mb-5"
      successClassName="bg-white"
      fields={fields}
      onSubmit={onSubmit}
      Success={Success}
    >
      <Input
        field={fields.get('footerEmail')}
        after={<Submit form={fields.form} className="h-full rounded-none">Join</Submit>}
      />
      <h3 className="font-bold text-sm -mt-1 text-white">
        Get 10% off your first rental
      </h3>
    </Form>
  )
}

export const FollowUs = () => (
  <div className="flex-row width-full max-w-20 content-evenly space-x-3">
    <SocialMediaIcon name="facebook" icon={iconFacebook} />
    <SocialMediaIcon name="instagram" icon={iconInstagram} />
    <SocialMediaIcon name="twitter" icon={iconTwitter} />
    <SocialMediaIcon name="tiktok" icon={iconTiktok} />
  </div>
)

export const SocialMediaIcon = ({ name, icon }) => (
  <Link prefetch={false} href={socialMediaLinks[name]}>
    <a aria-label={`Social media link to ${name}`}>
      <div className="rounded-full cursor-pointer items-center justify-center">
        <Icon icon={icon} className="w-6 h-6" />
      </div>
    </a>
  </Link>
)

export default Footer
