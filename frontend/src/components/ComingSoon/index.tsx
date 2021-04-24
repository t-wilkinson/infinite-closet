import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SimpleLineIcons } from '@expo/vector-icons'

import {
  Linking,
  button,
  div,
  Image,
  span,
  Divider,
  Icons,
  ScrollView,
  Dimensions,
} from '@/shared/components'
import { socialMediaLinks } from '@/shared/constants'
import Link from '@/shared/Link'

export default ({}) => {
  const insets = useSafeAreaInsets()
  const { height } = Dimensions.get('window')

  return (
    <ScrollView
      style={{
        backgroundColor: 'white',
        paddingTop: insets.top,
      }}
    >
      <div alignItems="center" bg="white" height={height}>
        <Banner />
        <Link to="/landing-page">
          <div
            width={{ base: 300, tablet: 400 }}
            style={{
              marginBottom: -50 + 16,
              marginTop: 16,
              height: 200,
            }}
          >
            <Image
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
              source={require('assets/brand/Logo-Lockup-(Transparent).png')}
            />
          </div>
        </Link>

        {/* <div alignItems="center" my="lg"> */}
        {/*   <Image */}
        {/*     style={{ width: 80, height: 50 }} */}
        {/*     source={require('assets/brand/Transparent-Hanger.png')} */}
        {/*   /> */}
        {/*   <span variant="header" fontSize={{ base: 40, tablet: 48 }}> */}
        {/*     Infinite Closet */}
        {/*   </span> */}
        {/*   <span variant="subheader" fontSize={20}> */}
        {/*     Less is More */}
        {/*   </span> */}
        {/* </div> */}

        <Divider />
        {/* <Divider mt="lg" /> */}

        <div flex={1} justifyContent="center" alignItems="center">
          <span
            variant="subheader"
            textAlign="center"
            padding="md"
            fontSize={{ base: 48, mobile: 64 }}
            my="xl"
          >
            MORE COMING SOON!
          </span>
          <Link to="/landing-page">
            <span textDecorationLine="underline">Go Back</span>
          </Link>
        </div>

        <Divider />

        <div
          flexDirection="row"
          width="100%"
          maxWidth={300}
          justifyContent="space-evenly"
          my="lg"
        >
          <SocialMediaIcon name="facebook" />
          <SocialMediaIcon name="instagram" />
          <SocialMediaIcon name="twitter" />
          <button
            onPress={() => Linking.openURL(socialMediaLinks.tiktok)}
          >
            <div borderWidth={1} borderRadius={999} p="md">
              <Icons.TikTok size={24} />
            </div>
          </button>
        </div>
      </div>
    </ScrollView>
  )
}

type SocialMedia<T extends string> = `social-${T}`
export const SocialMediaIcon = ({
  name,
  ...props
}: {
  name: 'facebook' | 'instagram' | 'twitter'
} & Partial<typeof SimpleLineIcons>) => (
  <button onPress={() => Linking.openURL(socialMediaLinks[name])}>
    <div borderWidth={1} borderRadius={999} p="md">
      <SimpleLineIcons
        size={20}
        name={('social-' + name) as SocialMedia<typeof name>}
        {...props}
      />
    </div>
  </button>
)

const Banner = () => (
  <div width="100%" alignItems="center" bg="sec" py="md" px="sm">
    <span variant="header" fontSize={24}>
      COMING JULY 1, 2021
    </span>
    <div height={8} />
    <span
      variant="subheader"
      textAlign="center"
      fontSize={18}
      textTransform="none"
    >
      Discover and rent the latest trends from fashions rising{' '}
    </span>
  </div>
)
