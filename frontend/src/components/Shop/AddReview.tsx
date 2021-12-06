import React from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import {
  useFields,
  Form,
  Dropdown,
  Submit,
  Input,
  FormHeader,
  Rating,
  ImageUpload,
  Textarea,
} from '@/Form/index_'

const fitValues = [
  { key: 'short', label: 'short' },
  { key: 'true', label: 'true' },
  { key: 'long', label: 'long' },
]

const AddReview = ({}) => {
  const router = useRouter()
  const productSlug = router.query.slug
  const [canReview, setCanReview] = React.useState(null)

  React.useEffect(() => {
    axios.get(`/products/${productSlug}/reviews/can-review`, {
      withCredentials: true
    })
      .then(res => res.data)
      .then(res => setCanReview(res.canReview))
      .catch(() => setCanReview(false))
  }, [])

  const fields = useFields({
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
    // submit: { label: 'Submit' },
  })

  React.useEffect(() => {
    if (canReview === false) {
      fields.form.setErrors('You cannot create a review for this product')
    }
  }, [canReview])

  const onSubmitInternal = async (e: React.FormEvent) => {
    const form = e.target
    const formData = new FormData()
    const cleaned = fields.clean()
    formData.append('heading', cleaned.heading)
    formData.append('message', cleaned.message)
    formData.append('fit', cleaned.fit)
    formData.append('rating', cleaned.rating)

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
      fields={fields}
      onSubmit={onSubmitInternal}
      className="overflow-y-auto w-full max-w-md"
    >
      <FormHeader label="How was your experience?" />
      <Rating field={fields.rating} />
      <Input field={fields.heading} />
      <Dropdown field={fields.fit} values={fitValues} />
      <ImageUpload field={fields.images} />
      <Textarea field={fields.message} rows={5} />
      <Submit field={fields.form}>Submit</Submit>
    </Form>
  )
}

export default AddReview
