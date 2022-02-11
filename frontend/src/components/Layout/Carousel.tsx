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
      <CarouselArrow
        valid={notTooSmall}
        onClick={() => notTooSmall && setIndex(index - 1)}
        icon={iconLeft}
      />
      {riders.slice(index, index + pageSize).map((rider, i) => (
        <div {...inner} key={index + i}>
          <Renderer {...map(rider)} />
        </div>
      ))}
      <CarouselArrow
        valid={notTooBig}
        onClick={() => notTooBig && setIndex(index + 1)}
        icon={iconRight}
      />
    </div>
  )
}

const CarouselArrow = ({ valid, icon, onClick }) =>
  <button
    className={` rounded-full p-3
      ${valid ? 'text-white bg-gray-black' : 'text-white bg-gray-light'}
    `}
    onClick={onClick}
  >
    <Icon icon={icon} size={20} />
  </button>


export default Carousel
