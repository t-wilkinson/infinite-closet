import React from 'react'
import Image from 'next/image'
import getConfig from 'next/config'

import qs from 'qs'

const { publicRuntimeConfig } = getConfig()
const { FACEBOOK_APP_ID } = publicRuntimeConfig

interface ShareFacebookConfig {
  url: string
  description: string
}

interface SharePinterestConfig {
  url: string
  description: string
  imageURL: string
}

// const createParams = (obj: { [key: string]: string | undefined }) =>
//   Object.entries(obj)
//     .filter(([, v]) => v !== undefined)
//     .map(([k, v]) => k + '=' + encodeURI(v as string))
//     .join('&')

const ratio = 32 / 13
const size = 28
const shareStyle = { width: size * ratio, height: size }

export default {
  Facebook: ({ url, description }: ShareFacebookConfig) => (
    <a
      href={
        'https://www.facebook.com/sharer/sharer.php?' +
        qs.stringify({
          u: url,
          quote: description,
          app_id: FACEBOOK_APP_ID,
          redirect_uri: url,
          display: 'popup',
          kid_directed_site: '0',
        })
      }
    >
      <Image
        layout="fill"
        objectFit="contain"
        src="/icons/facebook-share.png"
      />
    </a>
  ),

  Pinterest: ({ url, description, imageURL }: SharePinterestConfig) => (
    <a
      href={
        'https://www.pinterest.com/pin/create/button?' +
        qs.stringify({
          url,
          description,
          media: imageURL,
          method: 'button',
        })
      }
    >
      <Image layout="fill" objectFit="contain" src="/icons/pinit.jpg" />
    </a>
  ),
}

// app_id=
// https://www.facebook.com/sharer/sharer.php?u=%2Fshop%2Fdesigner-two%2Fshirt&quote=asdf&app_id=&redirect_uri=%2Fshop%2Fdesigner-two%2Fshirt&display=popup&kid_directed_site=0
// https://www.facebook.com/sharer/sharer.php?u=%2Fshop%2Fdesigner-two%2Fshirt&quote=asdf&redirect_uri=%2Fshop%2Fdesigner-two%2Fshirt&display=popup&kid_directed_site=0
