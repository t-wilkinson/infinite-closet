import React from 'react'
import Image from 'next/image'

import { Button } from '@/Components'

export const EditImage = ({
  url,
  image,
  updateImage,
  saveImage,
}) => {

  return <div className="w-full items-center">
    <div className="relative w-40 h-40">
      <Image src={url} layout="fill" objectFit="cover"
        style={{
          transform: `rotate(${image.rotation || 0}deg)`,
        }}
      />
    </div>
    <div className="flex-row w-full mt-4 justify-between">
      <button type="button"
        onClick={() => updateImage({...image, rotation: (Number(image.rotation || 0) - 90) % 360})}
      >
        left
      </button>
      <Button
        onClick={saveImage}
      >
        Save
      </Button>
      <button type="button"
        onClick={() => updateImage({...image, rotation: (Number(image.rotation || 0) + 90) % 360})}
      >
        right
      </button>
    </div>
  </div>

}

export default EditImage
