import React from 'react'

import axios from '@/utils/axios'
import {
  useFields,
  Form,
  Submit,
  Input,
  FormHeader,
  ImageUpload,
  Checkboxes,
  BodyWrapper,
} from '@/Form'
import { filterNames } from '@/Product/constants'
import RadioHeader from '@/Components/RadioHeader'

import { uploadWardrobeProduct, uploadWardrobeReceipt, getRecognitionFilters } from './api'

export const DoRecognition = () => {
  const fields = useFields<{
    currentTab: 'UploadReceipt' | 'UploadProduct'
  }>({
    currentTab: { default: 'UploadReceipt' },
  })

  return <div className="items-center mb-8">
    <div className="max-w-screen-sm w-full">
      <FormHeader label="Build Your Wardrobe" />
      <RadioHeader
        className="mb-8"
        field={fields.get('currentTab')}
        components={{
          UploadReceipt: ({}) => <>Upload Receipt</>,
          UploadProduct: ({}) => <>Create Product</>,
        }}
      />
    </div>
    {fields.getValue('currentTab') === 'UploadReceipt'
      ? <UploadReceipt />
      : <UploadProduct />
    }
  </div>
}

const UploadReceipt = () => {
  const fields = useFields<{
    images: any[]
  }>({
    images: { label: 'Add a receipt', default: []},
  })
  const onSubmit = async (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement
    const formData = new FormData()
    const cleaned = fields.clean()

    const images = form.elements['images'].files
    if (images.length === 0) {
      throw 'Please include your receipts'
    }
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    return uploadWardrobeReceipt(formData)
      .catch((err) => {
        throw 'We ran into an issue creating your outfit, please try again later.'
      })
  }

  if (fields.form.value === 'success') {
    return <BodyWrapper
      label={
        <>
          You have successfully uploaded a receipt!
        </>
      }
    >
      Please allow a couple minutes for us to process your submission.
    </BodyWrapper>
  }

  return <Form
    fields={fields}
    onSubmit={onSubmit}
  >
    <ImageUpload
      field={fields.get('images')}
      accept="image/*, application/pdf"
    />
    <Submit form={fields.form}>
      Upload
    </Submit>
  </Form>
}

const UploadProduct = ({}) => {
  const fields = useFields<{
    productName: string
    images: any[]
  } & { [key in keyof typeof filterNames]: Set<string> }
  >({
    productName: { label: 'Name' },
    images: { label: 'Add a photo', default: [] },
    ...filterNames.reduce((acc, filter) => {
      acc[filter] = { default: new Set() }
      return acc
    }, {}),
  })

  const [filters, setFilters] = React.useState(null)

  React.useEffect(() => {
    getRecognitionFilters()
      .then(filters => setFilters(filters))
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

    for (const filter in filters) {
      formData.append(filter, JSON.stringify(Array.from(cleaned[filter])))
    }

    console.log(cleaned.designer)
    const designers = Array.from(cleaned.designer)
    if (designers.length > 1) {
      throw 'Please select one designer'
    } else if (designers.length === 0) {
      throw 'Please select a designer'
    }
    formData.set('designer', designers[0])

    const images = form.elements['images'].files
    if (images.length === 0) {
      throw 'Please include an image of your outfit'
    }
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    return uploadWardrobeProduct(formData)
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
    {filters && <div>
      {Object.keys(filters).sort().map(filter =>
      <Checkboxes
        key={filter}
        field={fields.get(filter)}
        values={filters[filter]}
        single={filter === 'designer'}
      />
      )}
    </div>
    }
    <Submit form={fields.form}>
      Upload
    </Submit>
  </Form>
}

export default DoRecognition
