import React from 'react'
import { useRouter } from 'next/router'

import axios from '@/utils/axios'
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
} from '@/Form'
import {StrapiReview} from '@/types/models'

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
    axios
      .get<{canReview: boolean}>(`/products/${productSlug}/reviews/can-review`)
      .then((data) => setCanReview(data.canReview))
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
  })

  React.useEffect(() => {
    if (canReview === false) {
      fields.form.setErrors('You cannot create a review for this product')
    }
  }, [canReview])

  const onSubmitInternal = async (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement
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
      .post<{review: StrapiReview}>(`/products/${productSlug}/reviews`, formData)
      .then((data) => data.review)
      .catch(() => {
        throw 'You cannot create a review for this product'
      })
  }

  return (
    <Form
      fields={fields}
      onSubmit={onSubmitInternal}
      className="overflow-y-auto w-full max-w-md mb-16"
      redirect="/review/thankyou"
      test-id="add-review"
    >
      <FormHeader label="How was your experience?" />
      <Rating field={fields.get('rating')} />
      <Input field={fields.get('heading')} />
      <Dropdown field={fields.get('fit')} values={fitValues} />
      <ImageUpload field={fields.get('images')} />
      <Textarea field={fields.get('message')} rows={5} />
      <Submit field={fields.form}>Submit</Submit>
    </Form>
  )
}

export default AddReview
