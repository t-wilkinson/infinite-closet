import { Icons, iconStarFill, iconStarHalf } from '@/Components/Icons'

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

export default Rating
