const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')

dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Use same timezone for all dates for more predictable and reliable behavior
 * @param {DateLike} date - Returns dayjs object in Europe/London timezone
 */
function day(date) {
  return dayjs(date).tz('Europe/London')
}

module.exports = {
  day,
}
