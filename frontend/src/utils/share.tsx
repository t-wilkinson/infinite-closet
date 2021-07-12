import React from 'react'
import Image from 'next/image'

import qs from 'qs'

interface ShareFacebookConfig {
  url: string
  description: string
}

interface SharePinterestConfig {
  url: string
  description: string
  imageURL: string
}

// const ratio = 32 / 13
// const size = 28
// const shareStyle = { width: size * ratio, height: size }

export default {
  Facebook: ({ url, description }: ShareFacebookConfig) => (
    <a
      target="_blank"
      rel="noreferrer"
      href={
        'https://www.facebook.com/sharer/sharer.php?' +
        qs.stringify({
          u: url,
          quote: description,
          app_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          redirect_uri: url,
          display: 'popup',
          kid_directed_site: '0',
        })
      }
    >
      <Image
        alt="Share on Facebook"
        layout="fill"
        objectFit="contain"
        src="/icons/facebook-share.png"
      />
    </a>
  ),

  Pinterest: ({ url, description, imageURL }: SharePinterestConfig) => (
    <a
      target="_blank"
      rel="noreferrer"
      href={
        'http://pinterest.com/pin/create/button/?' +
        qs.stringify({
          url,
          description,
          media: process.env.NEXT_PUBLIC_BACKEND + imageURL,
        })
      }
    >
      <Image
        alt="Share on Pinterest"
        layout="fill"
        objectFit="contain"
        src="/icons/pinit.jpg"
      />
    </a>
  ),
}
