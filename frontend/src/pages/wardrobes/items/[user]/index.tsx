import React from 'react'
import { useRouter } from 'next/router'

import { WardrobePage, getWardrobePageData } from '@/Wardrobe/WardrobePages'

export const Page = ({data}) => {
  const router = useRouter()
  return <WardrobePage href={router.asPath.split(/\/|\?/).slice(0, 4).join('/')} data={data} />
}

export async function getServerSideProps({ params, query, req }) {
  return {
    props: await getWardrobePageData({ params, query, req })
  }
}

export default Page

