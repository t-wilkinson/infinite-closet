import React from 'react'

import { getURL } from '@/utils/axios'
import {
  useFields,
  Form,
  Submit,
  Input,
  BodyWrapper,
  ImageUpload,
  Checkboxes,
} from '@/Form'
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
    designerName: { default: product.customDesignerName || ''},
    productName: { label: 'Name', default: product.name},
    images: { label: 'Add a photo', default: {}},
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
    Promise.all(product.images.map(async image => {
      const url = await imageToObjectUrl(image)
      return {
        id: image.id,
        rotation: image.rotation,
        url,
      }
    }))
    .then(images => fields.setValue('images', images.reduce((acc, image) => {
      console.log(image)
      acc[image.url] = image
      return acc
    }, {})))
  }, [])

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
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }
    const previousImages = fields.getValue('images')
    formData.append('previousImages', JSON.stringify(previousImages))

    return editProductWardrobeItem(product.id, formData)
      .catch((err) => {
        throw 'We ran into an issue creating your outfit, please try again later.'
      })
  }

  if (fields.form.value === 'success') {
    return <BodyWrapper
      label={
        <>
          You have updated your item!
        </>
      }
    />
  }

  return <Form
    fields={fields}
    onSubmit={onSubmit}
  >
    <Input field={fields.get('productName')} />
    <Input field={fields.get('designerName')} />
    <ImageUpload field={fields.get('images')} />
    <span className="text-lg font-bold pt-2">
      Filters
    </span>
    {attributes && <div>
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
