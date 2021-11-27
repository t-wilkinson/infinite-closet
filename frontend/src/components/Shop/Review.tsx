import React from 'react'
import Image from 'next/image'

import { getURL } from '@/utils/api'
import dayjs from 'dayjs'
import { Icon } from '@/components'
import { iconStarFill, iconStarHalf } from '@/Icons'

const Review = ({
  fit,
  rating,
  user,
  images,
  heading,
  message,
  created_at,
}) => {

  return (
    <div className="bg-white p-4 border border-gray-light rounded-sm relative flex-row justify-between">
      <div className="space-y-3">
        <div className="flex-row space-x-4">
          <Rating rating={2.5} />
          <span className="text-sm text-gray">
            {dayjs(created_at).format('DD-MMM-YYYY')}
          </span>
        </div>
        <strong className="text-2xl font-bold pt-1">{heading}</strong>
        <span className="">{message}</span>
      </div>
      <div className="relative w-48 h-64">
        {images?.length > 0 && (
          <Image
            src={getURL(images[0].formats.large.url)}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </div>
  )
}

const Rating = ({ rating }) => {
  const nIcons = (n, icon, className = '') =>
    n > 0 && Array(n).fill(<Icon icon={icon} size={18} className={className} />)
  const numFullStars = Math.floor(rating)
  const useHalfStar = rating < 5 && rating % 1
  const numEmptyStars = Math.floor((useHalfStar ? 5 : 4) - rating)
  const fillColor = 'text-sec'
  const emptyColor = 'text-gray-light'

  return (
    <div className="flex-row space-x-1">
      {nIcons(numFullStars, iconStarFill, fillColor)}
      {useHalfStar ? (
        <div className="relative">
          {nIcons(1, iconStarFill, emptyColor)}
          {nIcons(1, iconStarHalf, `absolute left-0 ${fillColor}`)}
        </div>
      ) : null}
      {nIcons(numEmptyStars, iconStarFill, emptyColor)}
    </div>
  )
}

export default Review
