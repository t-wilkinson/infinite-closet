import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const fmtDate = (date) =>
    dayjs(date).tz('Europe/London').format('dddd, MMM D')

