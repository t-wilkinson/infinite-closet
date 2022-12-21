import React from 'react'
import Image from 'next/image'

import Popup from '@/Layout/Popup'
import {Icon, iconClose, iconPlus} from '@/Components/Icons'

import EditImage from './EditImage'

export const ImageUpload = ({ field, accept="image/*"}) => {
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let urls = Array.from(e.target.files).map((file: Blob) =>
        URL.createObjectURL(file)
      )
      field.setValue({
        ...field.value,
        ...urls.reduce((images, url) => {
          images[url] = field.value[url] || {}
          return images
        }, {})
      })
    }
  }
  const [editImage, setEditImage] = React.useState(null)

  return (
    <div className="my-4">
      <Popup
        isOpen={editImage}
        close={() => setEditImage(null)}
      >
        <EditImage
          url={editImage}
          image={field.value[editImage]}
          updateImage={image => {
            field.setValue({...field.value, [editImage]: image})
          }}
          saveImage={() => {
            setEditImage(null)
          }}
        />
      </Popup>
      <h3 className="font-bold text-lg">{field.label}</h3>
      <div className="flex-row w-full flex-wrap">
        {Object.keys(field.value).map((url) => (
          <UploadedImageWrapper key={url}>
            <button
              className="absolute top-0 right-0 m-2 z-10 bg-white rounded-full items-center justify-center p-1"
              onClick={() => {
                const images = {...field.value}
                delete images[url]
                field.setValue(images)
              }}
              type="button"
            >
              <Icon icon={iconClose} size={12} />
            </button>
            <button
              type="button"
              onClick={() => setEditImage(url)}
            >
              <Image src={url} layout="fill" objectFit="cover"
                style={{
                  transform: `rotate(${field.value[url].rotation || 0}deg)`,
                }}
              />
              Edit
            </button>
          </UploadedImageWrapper>
        ))}
        <UploadedImageWrapper>
          <label className="absolute inset-0 grid place-items-center cursor-pointer border border-gray rounded-md">
            <Icon icon={iconPlus} size={32} className="text-gray" />
            <input
              type="file"
              name="images"
              accept={accept}
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

export const UploadedImageWrapper = ({ children }) => (
  <div className="relative mr-2 mb-2 w-24 h-24 bg-gray-light overflow-hidden rounded-md flex-shrink-0">
    {children}
  </div>
)


export default ImageUpload
