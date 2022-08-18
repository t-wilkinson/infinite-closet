import React from 'react'

import { WardrobePage, getWardrobePageData } from '@/Wardrobe/WardrobePages'

export const Page = ({data}) => {
  return <WardrobePage href="/wardrobes/my-wardrobe" data={data} />
}

export async function getServerSideProps({ params, query, req }) {
  return {
    props: await getWardrobePageData({ params: {...params, 'page-name': 'my-wardrobe'}, query, req })
  }
}

export default Page
