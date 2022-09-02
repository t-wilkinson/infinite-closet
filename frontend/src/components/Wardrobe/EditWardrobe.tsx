import React from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'

import { Divider } from '@/Components'
import { useFields, UseFields, Input, Form, Checkbox, Submit, Textarea, Tags } from '@/Form'
import { Hover } from '@/Components/Hover'

import { updateWardrobe } from './api'

interface EditWardrobeFields {
  name: string;
  visible: boolean;
  description: string;
  tags: string[]
}

export const EditWardrobe = ({wardrobe, setWardrobes}) => {
  const fields = useFields<EditWardrobeFields>({
    name: {},
    visible: {},
    description: {},
    tags: {},
  })

  const updateFields = (wardrobe) => {
    fields.setValue('visible', wardrobe.visible)
    fields.setValue('tags', wardrobe.tags.map(tag => tag.name))
  }

  const onSubmit = () => {
    const props = fields.clean()
    updateWardrobe(wardrobe.id, props)
    .then(wardrobe => {
      setWardrobes(wardrobes => wardrobes.map(w => {
        if (w.wardrobe.id === wardrobe.id) {
          return {...w, wardrobe}
        } else {
          return w
        }
      }))
      updateFields(wardrobe)
    })
    .then(() => {
      fields.reset()
      toast.success(`Successfully updated wardrobe.`, {
        autoClose: 1500,
        hideProgressBar: true,
      })
    })
  }

  React.useEffect(() => {
    updateFields(wardrobe)
  }, [wardrobe])

  return <Form fields={fields} onSubmit={onSubmit} resubmit={true}>
    <Input field={fields.get('name')} />
    <Textarea field={fields.get('description')} />
    <div className="flex-row items-center">
      <Checkbox field={fields.get('visible')} />
      <Hover>
        Allow others to view this wardrobe.
      </Hover>
    </div>
    <Tags field={fields.get('tags')} />
    <Submit form={fields.form}>
      Update
    </Submit>
  </Form>
}

export const SideBar = ({fields, router, tags, wardrobes}: {
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
      <span className="text-xl mt-4 font-bold">
        My Wardrobes
      </span>
      {wardrobes.map(({wardrobe}, i) =>
      <Link
        key={wardrobe.id}
        type="button"
        href={`/wardrobes/edit/${wardrobe.slug}`}
        className={`py-1 px-2 text-left ${i === fields.getValue('currentWardrobe') ? 'rounded-md bg-gray-light' : ''}`}
      >
        <a>
        {wardrobe.name}
        </a>
      </Link>)}
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

// export const EditWardrobeWrapper = ({ children }) => {
//   const [wardrobes, setWardrobes] = React.useState(null)
//   const fields = useFields<SideBarFields>({
//     search: { label: 'Search wardrobes'},
//     tag: {},
//     currentWardrobe: {},
//   })
//   const router = useRouter()
//   const user = useSelector((state) => state.user.data)

//   // Initialize tags from query parameters
//   const tags = React.useMemo(() => {
//     const tag = router.query.tag
//     if (Array.isArray(tag)) {
//       return tag
//     } else if (typeof tag === 'string') {
//       return [tag]
//     } else {
//       return []
//     }
//   }, [router.query])

//   React.useEffect(() => {
//     const slug = router.query.slug
//     if (!slug) {
//       return
//     }
//     wardrobes?.forEach(({wardrobe}, i) => {
//       if (wardrobe.slug === slug) {
//         fields.setValue('currentWardrobe', i)
//       }
//     })
//   }, [router.query])

//   React.useEffect(() => {
//     if (router.query.search !== fields.value('search')) {
//       fields.setValue('search', router.query.search)
//     }
//   }, [router.query])

//   React.useEffect(() => {
//     searchWardrobes(`${user?.username || ''} ${fields.value('search') || ''}`.trim(), tags)
//       .then(wardrobes => {
//         if (wardrobes.length > 0) {
//           const slug = router.query.slug
//           wardrobes.forEach(({wardrobe}, i) => {
//             if (wardrobe.slug === slug) {
//               fields.setValue('currentWardrobe', i)
//             }
//           })
//         }
//         setWardrobes(wardrobes)
//       })
//   }, [fields.value('search'), tags, user])

//   if (wardrobes === null) {
//     return null
//   }

//   if (!user) {
//     return null
//   }
// }

export default EditWardrobe
