import React from 'react'
import Image from 'next/image'
import axios from 'axios'
import {useRouter} from 'next/router'

import Form, { Warning, Submit, TextArea, Input, Dropdown, FormHeader } from '@/Form'
import useFields, {attachErrors, cleanFields, fieldErrors, validateErrors} from '@/Form/useFields'
import { Icon, Icons } from '@/components'
import { iconClose, iconPlus, iconStarFill } from '@/Icons'

const fitValues = [
  { key: 'short', label: 'short' },
  { key: 'true', label: 'true' },
  { key: 'long', label: 'long' },
]

const AddReview = ({ }) => {
  const [state, setState] = React.useState<any>({})
  const router = useRouter()
  const productSlug = router.query.slug

  const fields = useFields({
    heading: {
      label: 'Headline',
      placeholder: 'What is most important to know?',
      constraints: 'required',
    },
    message: {
      label: 'Review', placeholder: 'What did you like or dislike?',
    },
    fit: {
      label: 'How true was the fit?',
      constraints: 'enum:short,true,long required',
      default: 'true',
    },
    rating: { label: 'Rating', constraints: 'between:1:5 required', default: null },
    images: { label: 'Add a photo or video', default: [] },
  })

  const _onSubmit = async (e) => {
    const form = e.target
    const formData = new FormData()
    const cleaned = cleanFields(fields)
    formData.append('heading', cleaned.heading)
    formData.append('message', cleaned.message)
    formData.append('fit', cleaned.fit)
    formData.append('rating', cleaned.rating)

    const errors = fieldErrors(fields)
    const valid = validateErrors(errors)
    attachErrors(fields, errors)
    if (!valid) {
      setState({status: 'error'})
      return
    }

    const images = form.elements['images'].files
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    axios
      .post(`/products/${productSlug}/reviews`, formData, {
        withCredentials: true,
      })
      .then(res => res.data.review)
      .then((review) => router.push('/review/thankyou'))
      .catch((err) => {
        setState({status: 'error', error: 'You cannot create review for this product.'})
      })
  }

  return (
    <Form onSubmit={_onSubmit} className="overflow-y-auto w-full">
      <FormHeader label="How was your experience?" />
      <div className="mt-2 mb-4">
        <Warning warnings={fields.rating.errors} />
        <Rating {...fields.rating} />
      </div>
      <Warning warnings={fields.heading.errors} />
      <Input {...fields.heading} />
      <Warning warnings={fields.fit.errors} />
      <Dropdown {...fields.fit} values={fitValues} />
      <ImageUpload {...fields.images} />
      <TextArea {...fields.message} />
      {state.status && state.error && <Warning>{state.error}</Warning>}
      <Submit>Submit</Submit>
    </Form>
  )
}

const Rating = ({ label, value, onChange, fillColor='text-sec', emptyColor='text-gray-light'}) => {
  const [hover, setHover] = React.useState<number | null>(null)

  if (isNaN(value) || !value) {
    onChange(null)
  } else if (value > 5) {
    onChange(5)
  } else if (value < 1) {
    onChange(1)
  }

  value = hover || value || 0

  return (
    <div className="items-center">
      <label className="text-lg">{label}*</label>
      <div className="flex-row space-x-1" onMouseLeave={() => setHover(null)}>
        <Icons
          onMouseEnter={(i) => setHover(i)}
          onClick={(i) => onChange(i)}
          n={value}
          icon={iconStarFill}
          className={`${fillColor} cursor-pointer`}
          size={24}
        />
        <Icons
          onMouseEnter={(i) => setHover(value + i)}
          onClick={(i) => onChange(value + i)}
          n={5 - value}
          icon={iconStarFill}
          className={`${emptyColor} hover:text-sec cursor-pointer`}
          size={24}
        />
      </div>
    </div>
  )
}

const ImageUpload = ({ label, onChange, value }) => {
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let urls = Array.from(e.target.files).map((file: Blob) =>
        URL.createObjectURL(file)
      )
      const uniqueUrls = Array.from(new Set(value.concat(urls)))
      onChange(uniqueUrls)
    }
  }

  return (
    <div className="my-4">
      <h3 className="font-bold text-lg">{label}</h3>
      <div className="flex-row w-full flex-wrap">
        {value.map((imgUrl: string) => (
          <UploadedImageWrapper key={imgUrl}>
            <button
              className="absolute top-0 right-0 m-2 z-10 bg-white rounded-full items-center justify-center p-1"
              onClick={() => onChange(value.filter((v) => v !== imgUrl))}
              type="button"
            >
              <Icon icon={iconClose} size={12} />
            </button>
            <Image src={imgUrl} layout="fill" objectFit="cover" />
          </UploadedImageWrapper>
        ))}
        <UploadedImageWrapper>
          <label className="absolute inset-0 grid place-items-center cursor-pointer border border-gray rounded-md">
            <Icon icon={iconPlus} size={32} className="text-gray" />
            <input
              type="file"
              name="images"
              className="hidden"
              onChange={onImageChange}
              multiple
            />
          </label>
        </UploadedImageWrapper>
      </div>
    </div>
  )
}

const UploadedImageWrapper = ({ children }) => (
  <div className="relative mr-2 mb-2 w-24 h-24 bg-gray-light overflow-hidden rounded-md flex-shrink-0">
    {children}
  </div>
)

export default AddReview
