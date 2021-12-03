import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import {
  Form,
  Dropdown,
  Submit,
  Input,
  FormHeader,
  Rating,
  ImageUpload,
} from '@/Form/index_'
import { UseFields } from '@/Form/fields'

const fitValues = [
  { key: 'short', label: 'short' },
  { key: 'true', label: 'true' },
  { key: 'long', label: 'long' },
]

const AddReview = ({}) => {
  const router = useRouter()
  const productSlug = router.query.slug

  const fields = new UseFields({
    heading: {
      label: 'Headline',
      placeholder: 'What is most important to know?',
      constraints: 'required',
    },
    message: {
      label: 'Review',
      placeholder: 'What did you like or dislike?',
    },
    fit: {
      label: 'How true was the fit?',
      constraints: 'enum:short,true,long required',
      default: 'true',
    },
    rating: {
      label: 'Rating',
      constraints: 'required between:1:5',
      default: null,
    },
    images: { label: 'Add a photo or video', default: [] },
  })

  const onSubmitInternal = async (e: React.SyntheticEvent) => {
    if (fields.form.value === 'submitting') {
      return
    }

    const form = e.target
    const formData = new FormData()
    const cleaned = fields.clean()
    formData.append('heading', cleaned.heading)
    formData.append('message', cleaned.message)
    formData.append('fit', cleaned.fit)
    formData.append('rating', cleaned.rating)

    const valid = fields.updateErrors()
    if (!valid) {
      return
    }

    const images = form.elements['images'].files
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    return axios
      .post(`/products/${productSlug}/reviews`, formData, {
        withCredentials: true,
      })
      .then((res) => res.data.review)
      .then(() => router.push('/review/thankyou'))
      .catch(() => {
        throw 'You cannot create a review for this product'
      })
  }

  return (
    <Form
      field={fields.form}
      onSubmit={onSubmitInternal}
      className="overflow-y-auto w-full"
    >
      <FormHeader label="How was your experience?" />
      <Rating field={fields.rating} />
      <Input field={fields.heading} />
      <Dropdown field={fields.fit} values={fitValues} />
      <ImageUpload field={fields.images} />
      <Input type="textarea" field={fields.message} rows={5} />
      <Submit field={fields.form}>Submit</Submit>
    </Form>
  )
}

export default AddReview
