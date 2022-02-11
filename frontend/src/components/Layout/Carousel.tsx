import React from 'react'

import { Icon, iconLeft, iconRight } from '@/Components/Icons'

interface Rider {}

export const Carousel = ({
  pageSize,
  riders,
  Renderer,
  map = (a): Rider => a,
  inner,
}: {
  pageSize: number
  riders: Rider[]
  Renderer: any
  inner: any
  map?: (_: any) => Rider
}) => {
  const [index, setIndex] = React.useState(0)
  const notTooBig = index < riders.length - pageSize
  const notTooSmall = index > 0

  return (
    <div className="flex-row w-full items-center space-x-12">
      <button
        className={`${notTooSmall ? 'text-gray-black' : 'text-gray-light'}`}
        onClick={() => notTooSmall && setIndex(index - 1)}
      >
        <Icon icon={iconLeft} size={30} />
      </button>
      {riders.slice(index, index + pageSize).map((rider, i) => (
        <div {...inner} key={index + i}>
          <Renderer {...map(rider)} />
        </div>
      ))}
      <button
        className={`${notTooBig ? 'text-gray-black' : 'text-gray-light'}`}
        onClick={() => notTooBig && setIndex(index + 1)}
      >
        <Icon icon={iconRight} size={30} />
      </button>
    </div>
  )
}

export default Carousel
