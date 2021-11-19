const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
const objectSupport = require('dayjs/plugin/objectSupport')
require('dayjs/locale/en-gb')

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)

dayjs.locale('en-gb')
dayjs.tz.setDefault('Europe/London')

// dayjs has some odd effects so we must:
//  check if a date is already a dayjs object
//  change dayjs objects to utc before comparing

/**
 * Use same timezone for all dates for more predictable and reliable behavior
 * @param {DateLike} date - Returns dayjs object in Europe/London timezone
 */
function day(date) {
  if (dayjs.isDayjs(date)) {
    return date
  } else {
    return dayjs.tz(date)
  }
}

module.exports = {
  day,
}
