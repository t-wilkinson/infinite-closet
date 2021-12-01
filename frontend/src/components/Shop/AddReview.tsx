import React from 'react'
import Image from 'next/image'
import axios from 'axios'

import Form, { Submit, TextArea, Input, Dropdown, FormHeader } from '@/Form'
import useFields, {cleanFields} from '@/Form/useFields'
import Popup from '@/Layout/Popup'
import { Icon, Icons } from '@/components'
import { iconClose, iconPlus, iconStarFill } from '@/Icons'

const fitValues = [
  { key: 'short', label: 'short' },
  { key: 'true', label: 'true' },
  { key: 'long', label: 'long' },
]

const AddReview = ({ order }) => {
  const [state, setState] = React.useState<boolean>(false)
  const fields = useFields({
    heading: {
      label: 'Headline',
      placeholder: 'What is most important to know?',
    },
    message: { label: 'Review', placeholder: 'What did you like or dislike?' },
    fit: {
      label: 'How true was the fit?',
      constraints: 'enum:short,true,long',
      default: 'true',
    },
    rating: { label: 'Rating', constraints: 'between:0:5', default: 0 },
    images: { label: 'Add a photo or video', default: [] },
  })

  const onSubmit = async (e) => {
    const form = e.target
    const formData = new FormData()
    const cleaned = cleanFields(fields)
    formData.append('heading', cleaned.heading)
    formData.append('message', cleaned.message)
    formData.append('fit', cleaned.fit)
    formData.append('rating', cleaned.rating)

    const images = form.elements['images'].files
    for (let i = 0; i < images.length; i++) {
      formData.append(images[i].name, images[i])
    }

    axios
      .post(`/products/${order.id}/reviews`, formData, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err))
  }

  return (
    <div>
      <button onClick={() => setState(!state)}>toggle</button>
      <Popup state={state} setState={setState}>
        <Form onSubmit={onSubmit} className="overflow-y-auto">
          <FormHeader label="How was your experience?" />
          <div className="mt-2 mb-4">
            <Rating {...fields.rating} />
          </div>
          <Input {...fields.heading} />
          <Dropdown {...fields.fit} values={fitValues} />
          <ImageUpload {...fields.images} />
          <TextArea {...fields.message} />
          <Submit>Submit</Submit>
        </Form>
      </Popup>
    </div>
  )
}

const Rating = ({ label, value, onChange }) => {
  const [hover, setHover] = React.useState<number | null>(null)

  if (isNaN(value)) {
    onChange(0)
  } else if (value > 5) {
    onChange(5)
  } else if (value < 0) {
    onChange(0)
  }

  value = hover || value

  return (
    <div className="items-center">
      <label className="text-lg">{label}</label>
      <div className="flex-row space-x-1" onMouseLeave={() => setHover(null)}>
        <Icons
          onMouseEnter={(i) => setHover(i)}
          onClick={(i) => onChange(i)}
          n={value}
          icon={iconStarFill}
          className="text-sec cursor-pointer"
        />
        <Icons
          onMouseEnter={(i) => setHover(value + i)}
          onClick={(i) => onChange(value + i)}
          n={5 - value}
          icon={iconStarFill}
          className="text-gray-light hover:text-sec cursor-pointer"
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
      onChange(value.concat(urls))
    }
  }

  return (
    <div className="my-4">
      <h3 className="font-bold text-lg">{label}</h3>
      <div className="flex-row w-full flex-wrap">
        {value.map((imgUrl: string) => (
          <UploadedImageWrapper>
            <button
              className="absolute top-0 right-0 m-2 z-10 bg-white rounded-full items-center justify-center p-1"
              onClick={() => onChange(value.filter((v) => v !== imgUrl))}
            >
              <Icon icon={iconClose} size={12} />
            </button>
            <Image key={imgUrl} src={imgUrl} layout="fill" />
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
