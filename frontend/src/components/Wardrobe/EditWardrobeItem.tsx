import React from 'react'

import { getURL } from '@/utils/axios'
import {
  useFields,
  Form,
  Submit,
  Input,
  ImageUpload,
  BodyWrapper,
  Checkboxes,
  Drawer,
} from '@/Form'
import { Search } from '@/Form/Search'
import { filterNames } from '@/Product/constants'

import { editProductWardrobeItem, getRecognitionAttributes } from './api'

const imageToObjectUrl = async (image) => {
  return fetch(getURL(image.url))
  .then(res => res.blob())
  .then(blob => URL.createObjectURL(blob))
}

const EditWardrobeItem = ({product}) => {
  // initialize product filters
  const fields = useFields<{
    designerName: string
    productName: string
    images: any[]
  } & { [key in keyof typeof filterNames]: Set<string> }
  >({
    designerName: {},
    productName: { label: 'Name', default: product.name},
    images: { label: 'Add a photo', default: product.images.map(imageToObjectUrl) },
    ...filterNames.reduce((acc, filter) => {
      if (Array.isArray(product?.[filter])) {
        acc[filter] = { default: new Set(product[filter].map(v => v.slug)) }
      } else {
        acc[filter] = { default: new Set()}
      }
      return acc
    }, {} as any),
  })

  const [attributes, setAttributes] = React.useState(null)

  React.useEffect(() => {
    getRecognitionAttributes()
      .then(attributes => setAttributes(attributes))
      .catch((err) => console.error(err))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement
    const formData = new FormData()
    const cleaned = fields.clean()

    if (!cleaned.productName) {
      throw 'Please name your outfit'
    }
    formData.append('name', cleaned.productName)

    for (const filter in attributes.filters) {
      formData.append(filter, JSON.stringify(Array.from(cleaned[filter])))
    }

    formData.set('designer', cleaned.designerName)

    const images = form.elements['images'].files
    if (images.length === 0) {
      throw 'Please include an image of your outfit'
    }
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    return editProductWardrobeItem(product.id, formData)
      .catch((err) => {
        throw 'We ran into an issue creating your outfit, please try again later.'
      })
  }

  if (fields.form.value === 'success') {
    return <BodyWrapper
      label={
        <>
          You have successfully created a product!
        </>
      }
    />
  }

  return <Form
    fields={fields}
    onSubmit={onSubmit}
  >
    <Input field={fields.get('productName')} />
    <ImageUpload field={fields.get('images')} />
    <span className="text-lg font-bold pt-2">
      Filters
    </span>
    {attributes && <div>
      <Drawer label={fields.get('designerName').label}>
        <Search
          field={fields.get('designerName')}
          values={attributes.designers}
        />
    </Drawer>
      {Object.keys(attributes.filters).sort().map(filter =>
      <Checkboxes
        key={filter}
        field={fields.get(filter)}
        values={attributes.filters[filter]}
      />
      )}
    </div>
    }
    <Submit form={fields.form}>
      Update
    </Submit>
  </Form>
}

export default EditWardrobeItem
