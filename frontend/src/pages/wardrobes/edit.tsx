import React from 'react'
import { NextRouter, useRouter } from 'next/router'

import { Divider } from '@/Components'
import { useSelector } from '@/utils/store'
import { useFields, UseFields, Input } from '@/Form'
import { Icon, iconClose } from '@/Components/Icons'
import Layout from '@/Layout'
import { searchWardrobes } from '@/Wardrobe/api'
import { Wardrobe } from '@/Wardrobe/Wardrobe'
import { EditWardrobe } from '@/Wardrobe/EditWardrobe'

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
    if (router.query.search !== fields.value('search')) {
      fields.setValue('search', router.query.search)
    }
  }, [router.query])

  React.useEffect(() => {
    searchWardrobes(`${user?.username || ''} ${fields.value('search') || ''}`.trim(), tags)
      .then(wardrobes => {
        if (wardrobes.length > 0) {
          fields.setValue('currentWardrobe', 0)
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

  const currentWardrobe = wardrobes[fields.value('currentWardrobe')].wardrobe
  const currentProducts = wardrobes[fields.value('currentWardrobe')].products

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
        : <Wardrobe wardrobe={currentWardrobe} products={currentProducts} href="/wardrobes/edit" />

      }

      <div>
        <span className="text-xl mb-4 font-bold text-center">Edit Wardrobe</span>
    <EditWardrobe wardrobe={currentWardrobe} setWardrobes={setWardrobes} />
      </div>
    </div>
  </div>
}

const SideBar = ({fields, router, tags, wardrobes}: {
  fields: UseFields<SideBarFields>
  tags: string[]
  router: NextRouter
  wardrobes: any[]
}) => {
  const addTag = (tag: string) => {
    if (!tag || tags.includes(tag)) {
      return
    }
    fields.setValue('tag', '')
    router.replace({
      query: { ...router.query, tag: [...tags, tag]},
    })
  }

  const removeTag = (tag: string) => {
    router.replace({
      query: { ...router.query, tag: tags.filter(t => t !== tag)},
    })
  }

  return <aside>
    <Input
      // before={<Icon icon={iconSearch} size={20} />}
      field={fields.get('search')}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
        }
      }}
    />
    <div className="mb-4" />
    <Input
      // before={<Icon icon={iconSearch} size={20} />}
      field={fields.get('tag')}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          addTag(fields.value('tag'))
        }
      }}
    />
    <Divider />
    <div className="flex-row">
      {tags.map((tag) => <FilterTag key={tag} tag={tag} removeTag={removeTag}/>)}
    </div>
    <div>
      <span className="text-xl mx-2 mt-4 font-bold">
        Wardrobes
      </span>
      {wardrobes.map(({wardrobe}, i) =>
      <button
        key={wardrobe.id}
        type="button"
        onClick={() => fields.setValue('currentWardrobe', i)}
        className={`py-1 px-2 text-left ${i === fields.getValue('currentWardrobe') ? 'rounded-md bg-gray-light' : ''}`}
      >
        {wardrobe.name}
      </button>)}
    </div>
  </aside>
}

const FilterTag = ({tag, removeTag}) =>
  <span
    className="relative rounded-lg bg-pri-white px-2 pr-3 py-1 mt-2 mr-2 cursor-pointer"
    onClick={() => removeTag(tag)}
  >
    {tag}
      <Icon className="absolute top-0 right-0 m-1" icon={iconClose} size={8} />
  </span>

export default Page

