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

const HOURS_IN_DAY = 24;

const rentalLengths = {
  // first and last day of the rental are 12 hours each, so subtract a day
  short: (4 - 1) * HOURS_IN_DAY,
  long: (8 - 1) * HOURS_IN_DAY,
};

const HOURS_SEND_CLIENT = 2 * HOURS_IN_DAY; // 2 day shipping
const HOURS_SEND_CLEANERS = 2 * HOURS_IN_DAY; // 2 day shipping
const HOURS_TO_CLEAN = 1 * HOURS_IN_DAY; // oxwash takes 24 hours to clean
const HIVED_CUTOFF = 12; // this needs to be precise; watch minutes/seconds offsets

function arrival(sent) {
  let arrives;
  if (sent.hour() > HIVED_CUTOFF) {
    arrives = sent
      .add(HOURS_SEND_CLIENT + HOURS_IN_DAY, "hours") // will take an extra day to arrive
      .hour(HIVED_CUTOFF);
  } else {
    arrives = sent.add(HOURS_SEND_CLIENT, "hours").hour(HIVED_CUTOFF);
  }
  return arrives;
}

function range({ startDate, shippingDate, rentalLength }) {
  rentalLength = rentalLengths[rentalLength];

  const shipped = shippingDate
    ? dayjs(shippingDate).tz("Europe/London")
    : dayjs(startDate).tz("Europe/London").subtract(HOURS_SEND_CLIENT, "hours");

  const start = arrival(shipped);
  const end = start.add(rentalLength, "hours");
  const cleaned = end.add(HOURS_SEND_CLEANERS, "hours"); // at this point the order arrives at the cleaner

  // oxwash doesn't operate on saturday/sunday
  // check if arrival date is on sunday, friday, or saturday
  let CLEANING_DELAY = 0;
  if (cleaned.date() === 0) {
    CLEANING_DELAY += 24;
  } else if (cleaned.date() === 5) {
    CLEANING_DELAY += 48;
  } else if (cleaned.date() === 6) {
    CLEANING_DELAY += 72;
  }
  const completed = cleaned.add(HOURS_TO_CLEAN + CLEANING_DELAY, "hours");

  return { shipped, start, end, cleaned, completed };
}

function rangesOverlap(range1, range2) {
  return !(
    range1.completed.isBefore(range2.shipped) ||
    range1.shipped.isAfter(range2.completed)
  );
}

function valid(date) {
  date = dayjs(date).tz("Europe/London");
  const today = dayjs().tz("Europe/London");

  const arrives = arrival(today);
  const enoughShippingTime = date.isSameOrAfter(arrives, "day");

  return enoughShippingTime;
}

module.exports = { valid, arrival, range, rangesOverlap };
