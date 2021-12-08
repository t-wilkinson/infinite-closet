import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Divider } from '@/components'
import { socialMediaLinks } from '@/utils/config'
import Header from '@/Layout/Header'
import {
  Icon,
  iconInstagram,
  iconFacebook,
  iconTwitter,
  iconTiktok,
} from '@/Icons'

const Page = () => {
  return (
    <>
      <Head>
        <title>More Coming Soon</title>
      </Head>
      <Header />
      <ComingSoon />
      <Divider />
    </>
  )
}

const ComingSoon = () => {
  const router = useRouter()

  return (
    <div className="items-center bg-white flex-grow">
      <div className="flex-grow justify-center items-center">
        <span className="font-subheader text-center p-4 text-6xl my-8">
          MORE COMING SOON
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            router.back()
          }}
        >
          <span className="text-blue-500 cursor-pointer hover:underline">
            Go Back
          </span>
        </a>
      </div>

      <Divider />

      <div className="flex-row w-full max-w-sm justify-evenly my-6">
        <SocialMediaIcon name="facebook" icon={iconFacebook} />
        <SocialMediaIcon name="instagram" icon={iconInstagram} />
        <SocialMediaIcon name="twitter" icon={iconTwitter} />
        <SocialMediaIcon name="tiktok" icon={iconTiktok} />
      </div>
    </div>
  )
}

const SocialMediaIcon = ({ name, icon }) => (
  <Link href={socialMediaLinks[name]}>
    <a aria-label={`Social media link to ${name}`}>
      <div className="border border-gray rounded-full p-4 items-center justify-center">
        <Icon size={20} icon={icon} />
      </div>
    </a>
  </Link>
)

export default Page
