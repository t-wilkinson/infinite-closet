import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { Dayjs } from '@/types'

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.guess()
dayjs.tz.setDefault('Europe/London')

export const createDateFormat = (defFormat: string, formats: object) => {
  const locale = dayjs.locale()
  if (locale in formats) {
    return (date: Dayjs) => date.format(formats[locale])
  } else {
    return (date: Dayjs) => date.format(defFormat)
  }
}

export default dayjs
