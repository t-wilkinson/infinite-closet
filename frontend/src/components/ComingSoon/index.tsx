import React from 'react'
import Link from 'next/link'

import { Divider, Icon } from '@/components'
import { socialMediaLinks } from '@/utils/constants'

export const ComingSoon = () => {
  // TODO: use router.back
  return (
    <div className="items-center bg-white flex-grow">
      <div className="flex-grow justify-center items-center">
        <span className="font-subheader text-center p-4 text-6xl my-8">
          MORE COMING SOON
        </span>
        <Link href="/">
          <a>
            <span className="text-blue-500 cursor-pointer hover:underline">
              Go Back
            </span>
          </a>
        </Link>
      </div>

      <Divider />

      <div className="flex-row w-full max-w-sm justify-evenly my-6">
        <SocialMediaIcon name="facebook" />
        <SocialMediaIcon name="instagram" />
        <SocialMediaIcon name="twitter" />
        <SocialMediaIcon name="tiktok" />
      </div>
    </div>
  )
}
export default ComingSoon

export const SocialMediaIcon = ({ name }) => (
  <Link href={socialMediaLinks[name]}>
    <a aria-label={`Social media link to ${name}`}>
      <div className="border border-gray rounded-full p-4 items-center justify-center">
        <Icon size={20} name={name} />
      </div>
    </a>
  </Link>
)
