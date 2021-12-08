import React from 'react'

import {Icons, iconStarFill} from '@/Icons'

import Warning from './Warning'

export const Rating = ({
  field,
  fillColor = 'text-sec',
  emptyColor = 'text-gray-light',
}) => {
  const [hover, setHover] = React.useState<number | null>(null)
  let { value, setValue } = field

  if (isNaN(value) || !value) {
    setValue(null)
  } else if (value > 5) {
    setValue(5)
  } else if (value < 1) {
    setValue(1)
  }

  value = hover || value || 0

  return (
    <div className="items-center my-2">
      <label className="text-lg">{field.label}*</label>
      <div className="flex-row space-x-1" onMouseLeave={() => setHover(null)}>
        <Icons
          onMouseEnter={(i: number) => setHover(i)}
          onClick={(i: number) => setValue(i)}
          n={value}
          icon={iconStarFill}
          className={`${fillColor} cursor-pointer`}
          size={24}
        />
        <Icons
          onMouseEnter={(i: number) => setHover(value + i)}
          onClick={(i: number) => setValue(value + i)}
          n={5 - value}
          icon={iconStarFill}
          className={`${emptyColor} hover:text-sec cursor-pointer`}
          size={24}
        />
      </div>
      <Warning warnings={field.errors} />
    </div>
  )
}

export default Rating
