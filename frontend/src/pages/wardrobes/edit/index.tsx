import React from 'react'
import { NextRouter, useRouter } from 'next/router'

import { useSelector } from '@/utils/store'
import { useFields, UseFields, Input } from '@/Form'
import { Icon, iconClose } from '@/Components/Icons'
import Layout from '@/Layout'
import { searchWardrobes } from '@/Wardrobe/api'
import { Wardrobe } from '@/Wardrobe/Wardrobe'
import { SideBar, EditWardrobe } from '@/Wardrobe/EditWardrobe'

interface SideBarFields {
  search: string;
  tag: string;
}

export const Page = ({ }) => {
  return <>
    <Layout title="Wardrobes">
      <div className="items-center w-full">
        <Wardrobes />
        <div className="mb-4" />
      </div>
    </Layout>
  </>
}

const Wardrobes = () => {
  const [wardrobes, setWardrobes] = React.useState(null)
  const fields = useFields<SideBarFields>({
    search: { label: 'Search wardrobes'},
    tag: {},
    currentWardrobe: {},
  })
  const router = useRouter()
  const user = useSelector((state) => state.user.data)

  // Initialize tags from query parameters
  const tags = React.useMemo(() => {
    const tag = router.query.tag
    if (Array.isArray(tag)) {
      return tag
    } else if (typeof tag === 'string') {
      return [tag]
    } else {
      return []
    }
  }, [router.query])

  React.useEffect(() => {
    const slug = router.query.slug
    if (!slug) {
      return
    }
    wardrobes?.forEach(({wardrobe}, i) => {
      if (wardrobe.slug === slug) {
        fields.setValue('currentWardrobe', i)
      }
    })
  }, [router.query])

  React.useEffect(() => {
    if (router.query.search !== fields.value('search')) {
      fields.setValue('search', router.query.search)
    }
  }, [router.query])

  React.useEffect(() => {
    searchWardrobes(`${user?.username || ''} ${fields.value('search') || ''}`.trim(), tags)
      .then(wardrobes => {
        if (wardrobes.length > 0) {
          const slug = router.query.slug
          wardrobes.forEach(({wardrobe}, i) => {
            if (wardrobe.slug === slug) {
              fields.setValue('currentWardrobe', i)
            }
          })
        }
        setWardrobes(wardrobes)
      })
  }, [fields.value('search'), tags, user])

  if (wardrobes === null) {
    return null
  }

  if (!user) {
    return null
  }

  return <div className="flex-row w-full max-w-screen-xl h-full md:px-4 xl:px-0">
    <div className="w-full sm:w-64 md:w-72 flex-none">
      <SideBar fields={fields} router={router} tags={tags} wardrobes={wardrobes} />
    </div>
    <div className="hidden md:block w-4 flex-none" />
    <div className="w-full overflow-hidden">
      {wardrobes.length === 0
        ? <div className="w-full h-24 bg-gray-light grid place-items-center">
          <span className="">
            No wardrobe found
          </span>
        </div>
        : wardrobes.map(({wardrobe, products}) =>
          <Wardrobe
            key={wardrobe.id} wardrobe={wardrobe} products={products}
        tagsHref="/wardrobes/edit"
        />
        )
      }
    </div>
  </div>
}

export default Page


