import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

import { getURL } from '@/utils/axios'
import { StrapiOrder } from '@/types/models'
import { Icons } from '@/Icons'
import { iconStarFill, iconStarHalf } from '@/Icons'
import * as sizing from '@/utils/sizing'

const Review = ({
  user,
  size,
  review: { fit, rating, images, heading, message, created_at },
}: StrapiOrder) => {
  return (
    <article className="flex bg-white p-4 border border-gray-light rounded-sm relative flex-row justify-between h-80">
      <div className="w-32">
        <SideInfo size={size} user={user} fit={fit} />
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
        {images?.[0]?.url && (
          <Image
            src={getURL(images?.[0]?.url)}
            layout="fill"
            objectFit="cover"
          />
        )}
      </div>
    </article>
  )
}

const subObj = (obj: object, keys: string[]) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)))

const heights = [4, 5, 6]
  .map((feet) =>
    Array(12)
      .fill(0)
      .map((_, i) => i + 1)
      .map((inches) => ({
        label: `${feet}' ${inches}"`,
        key: `${feet}-${inches}`,
      }))
  )
  .flat()
  .slice(5, -6)

const SideInfo = ({ user, fit, size}) => {
  const userInfoKeys = [
    'chestSize',
    'hipsSize',
  ]
  const height = user.height && heights.find(value => value.key === user.height)

  return (
    <aside className="flex flex-col">
      <span className="font-bold text-lg">
        {user.firstName} {user.lastName}
      </span>
      <div className="w-full h-px bg-pri-light my-2" />
      <table>
        <tbody>
          <Row label="fit" value={fit} />
          {Object.entries(subObj(user, userInfoKeys)).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
          {size && <Row label='dress size' value={sizing.normalize(size)} />}
          {user.dressSize && <Row label='normally wears' value={`${sizing.normalize(user.dressSize)}`} />}
          {height && <Row label='height' value={`${height.label}`} />}
          {user.weight && <Row label='weight' value={`${user.weight}kgs`} />}
        </tbody>
      </table>
    </aside>
  )
}

const keyToTh = (key = '') =>
  key.charAt(0).toUpperCase() +
  key.slice(1).replace(/([A-Z])/g, (m) => ' ' + m.toLowerCase())
const Row = ({ label, value }) =>
  !value ? null : (
    <tr>
      <th className="font-bold text-sm text-left w-28">{keyToTh(label)}:</th>
      <td>{value}</td>
    </tr>
  )

export const Rating = ({
  rating,
  fillColor = 'text-sec',
  emptyColor = 'text-gray-light',
}) => {
  const numStars = getNumStars(rating)

  return (
    <div className="flex-row space-x-1">
      <Icons n={numStars.full} icon={iconStarFill} className={fillColor} />
      {numStars.useHalf ? (
        <div className="relative">
          <Icons n={1} icon={iconStarFill} className={emptyColor} />
          <Icons
            n={1}
            icon={iconStarHalf}
            className={`absolute left-0 ${fillColor}`}
          />
        </div>
      ) : null}
      <Icons n={numStars.empty} icon={iconStarFill} className={emptyColor} />
    </div>
  )
}

export const getNumStars = (rating: number) => ({
  full: Math.floor(rating),
  useHalf: Boolean(rating < 5 && rating % 1),
  empty: Math.floor(5 - rating),
})

export default Review
