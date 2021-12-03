import Image from 'next/image'
import {Icon} from '@/components'

import {iconClose, iconPlus} from '@/components/Icons'

export const ImageUpload = ({ field }) => {
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let urls = Array.from(e.target.files).map((file: Blob) =>
        URL.createObjectURL(file)
      )
      const uniqueUrls = Array.from(new Set(field.value.concat(urls)))
      field.setValue(uniqueUrls)
    }
  }

  return (
    <div className="my-4">
      <h3 className="font-bold text-lg">{field.label}</h3>
      <div className="flex-row w-full flex-wrap">
        {field.value.map((imgUrl: string) => (
          <UploadedImageWrapper key={imgUrl}>
            <button
              className="absolute top-0 right-0 m-2 z-10 bg-white rounded-full items-center justify-center p-1"
              onClick={() =>
                field.setValue(field.value.filter((v) => v !== imgUrl))
              }
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
              accept="image/*"
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
