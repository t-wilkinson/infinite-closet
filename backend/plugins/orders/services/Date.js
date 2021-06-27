"use strict";

const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

const rentalLengths = {
  // first and last day of the rental are 12 hours each
  short: (4 - 1) * 24,
  long: (8 - 1) * 24,
};

const HOURS_SEND_CLIENT = 2 * 24; // TODO: if order.date is before 12:00pm, 24 hours
const HOURS_SEND_CLEANERS = 2 * 24;
const HOURS_TO_CLEAN = 1 * 24;

module.exports = {
  range({ date, shippingDate, rentalLength }) {
    rentalLength = rentalLengths[rentalLength];
    const shipping = dayjs(shippingDate || date).tz("Europe/London");
    const start = shipping.subtract(HOURS_SEND_CLIENT, "hours");
    const rentalOver = shipping.add(rentalLength, "hours");
    const cleaning = over.add(HOURS_SEND_CLEANERS, "hours");
    const end = cleaning.add(HOURS_TO_CLEAN, "hours");

    return { start, shipping, rentalOver, cleaning, end };
  },

  rangesOverlap(range1, range2) {
    return !(
      range1.end.isBefore(range2.start) || range1.start.isAfter(range2.end)
    );
  },

  valid(date) {
    date = dayjs(date).tz("Europe/London");
    const today = dayjs().tz("Europe/London");

    const isNotSunday = date.day() !== 0;
    const shippingCutoff = today.add(HOURS_SEND_CLIENT, "hours");
    const enoughShippingTime = date.isSameOrAfter(shippingCutoff, "day");

    return isNotSunday && enoughShippingTime;
  },
};
