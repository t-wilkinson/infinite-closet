import React from 'react'
import { Image, Linking, button } from '@/shared/components'
import { extras } from '@/shared/constants'

interface ShareFacebookConfig {
  url: string
  description: string
}

interface SharePinterestConfig {
  url: string
  description: string
  imageURL: string
}

const share = (url: string) => {
  if (url) {
    Linking.openURL(url)
      .then((data) => console.log(data))
      .catch((err) => console.error(err))
  }
}

const createParams = (obj: { [key: string]: string | undefined }) =>
  Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => k + '=' + encodeURI(v as string))
    .join('&')

const ratio = 32 / 13
const size = 28
const shareStyle = { width: size * ratio, height: size }

export default {
  Facebook: ({ url, description }: ShareFacebookConfig) => (
    <button
      onPress={() =>
        share(
          'https://www.facebook.com/sharer/sharer.php?' +
            createParams({
              u: url,
              quote: description,
              app_id: extras.facebook_app_id,
              redirect_uri: url,
              display: 'popup',
              kid_directed_site: '0',
            }),
        )
      }
    >
      <Image
        style={shareStyle}
        resizeMode="contain"
        source={require('/icons/facebook-share.png')}
      />
    </button>
  ),

  Pinterest: ({ url, description, imageURL }: SharePinterestConfig) => (
    <button
      onPress={() =>
        share(
          'https://www.pinterest.com/pin/create/button/?' +
            createParams({
              url,
              description,
              media: imageURL,
              method: 'button',
            }),
        )
      }
    >
      <Image
        style={shareStyle}
        resizeMode="contain"
        source={require('/icons/pinit.jpg')}
      />
    </button>
  ),
}
