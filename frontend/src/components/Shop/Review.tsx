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
    <div className="bg-white p-4 border border-gray-light rounded-sm relative flex-row justify-between h-80">
      <div className="w-32">
        <SideInfo user={user} fit={fit} />
      </div>
      {/* <div className="w-px bg-pri-light mx-4" /> */}
      <div className="space-y-3 flex-grow ml-8">
        <div className="flex-row space-x-4">
          <Rating rating={rating} />
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

const subObj = (obj: object, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)))

const SideInfo = ({ user, fit }) => {
  const userInfoKeys = [
    'chestSize',
    'hipsSize',
    'dressSize',
    'height',
    'weight',
  ]

  return (
    <div>
      <span className="font-bold text-lg">
        {user.firstName} {user.lastName}
      </span>
      <div className="w-full h-px bg-pri-light my-2" />
      <tbody>
        <Row label="fit" value={fit} />
        {Object.entries(subObj(user, userInfoKeys)).map(([k, v]) => (
          <Row label={k} value={v} />
        ))}
      </tbody>
    </div>
  )
}

const keyToTh = (key = '') =>
  key.charAt(0).toUpperCase() +
  key.slice(1).replace(/([A-Z])/g, (m) => ' ' + m.toLowerCase())
const Row = ({ label, value }) =>
  !value ? null : (
    <tr>
      <th className="font-bold text-sm text-left w-24">{keyToTh(label)}:</th>
      <td>{value}</td>
    </tr>
  )

export const Rating = ({
  rating,
  fillColor = 'text-sec',
  emptyColor = 'text-gray-light',
}) => {
  const nIcons = (n: number, icon: any, className = '') =>
    n > 0 && Array(n).fill(<Icon icon={icon} size={18} className={className} />)
  const numFullStars = Math.floor(rating)
  const useHalfStar = rating < 5 && rating % 1
  const numEmptyStars = Math.floor((useHalfStar ? 5 : 4) - rating)

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
