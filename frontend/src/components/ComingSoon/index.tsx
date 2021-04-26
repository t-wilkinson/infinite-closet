import React from 'react'
import Link from 'next/link'

import { Divider, Icon } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const ComingSoon = () => {
  return (
    <div className="items-center bg-white flex-grow">
      <div className="flex-grow justify-center items-center">
        <span className="font-subheader text-center p-4 text-6xl my-8">
          MORE COMING SOON!
        </span>
        <Link href="/landing-page">
          <span className="text-blue-500 cursor-pointer hover:underline">
            Go Back
          </span>
        </Link>
      </div>

      <Divider />

      <div className="flex-row w-full max-w-sm justify-evenly my-6">
        <SocialMediaIcon name="facebook" />
        <SocialMediaIcon name="instagram" />
        <SocialMediaIcon name="twitter" />
        <Link href={socialMediaLinks.tiktok}>
          <div className="border rounded-full p-4">
            <Icon name="tiktok" size={24} />
          </div>
        </Link>
      </div>
    </div>
  )
}
export default ComingSoon

export const SocialMediaIcon = ({ name }) => (
  <Link href={socialMediaLinks[name]}>
    <div className="border rounded-full p-4">
      <Icon size={20} name={name} />
    </div>
  </Link>
)
