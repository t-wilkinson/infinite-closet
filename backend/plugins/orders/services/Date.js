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
  short: 4,
  long: 8,
};

const DAYS_TO_SHIP = 2;
const DAYS_TO_RECIEVE = 2;
const DAYS_TO_CLEAN = 2;

module.exports = {
  range({ date, rentalLength }) {
    date = dayjs(date);
    rentalLength = rentalLengths[rentalLength];
    // TODO: calculate how many days this item will take to ship based on status etc.
    // !TODO: need to take into account if before 12:00pm
    return {
      start: date.subtract(DAYS_TO_SHIP, "days"),
      returning: date.add(rentalLength, "days"),
      cleaning: date.add(rentalLength + DAYS_TO_RECIEVE, "days"),
      end: date.add(rentalLength + DAYS_TO_RECIEVE + DAYS_TO_CLEAN, "days"),
    };
  },

  rangesOverlap(range1, range2) {
    return !(
      range1.end.isBefore(range2.start) || range1.start.isAfter(range2.end)
    );
  },

  valid(date, same = false) {
    date = dayjs(date).tz("Europe/London");
    const today = dayjs().tz("Europe/London");

    const isNotSunday = date.day() !== 0;
    const shippingCutoff = today.add(12, "hour").add(DAYS_TO_SHIP, "day");

    let enoughShippingTime;
    if (same) {
      enoughShippingTime = date.isSame(shippingCutoff, "day");
    } else {
      enoughShippingTime = date.isSameOrAfter(shippingCutoff, "day");
    }

    return isNotSunday && enoughShippingTime;
  },
};
