import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

// TODO: this is copied from backend, move it to a route
const rentalLengths = {
  short: 4,
  long: 8,
};

const DAYS_TO_SHIP = 2;
const DAYS_TO_RECIEVE = 2;
const DAYS_TO_CLEAN = 2;

function toRange({ date, length }) {
  date = dayjs(date);
  const rentalLength = rentalLengths[length];
  return {
    start: date.subtract(DAYS_TO_SHIP, "day"),
    returning: date.add(dayjs.duration({ days: rentalLength })),
    cleaning: date.add(
      dayjs.duration({ days: rentalLength + DAYS_TO_RECIEVE })
    ),
    end: date.add(
      dayjs.duration({ days: rentalLength + DAYS_TO_RECIEVE + DAYS_TO_CLEAN })
    ),
  };
}

const showRange = (ranges, status) => {
  let date;
  switch (status) {
    case "planning":
      date = ranges.start;
      break;
    case "shipping":
      date = ranges.returning;
      break;
    case "cleaning":
      date = ranges.cleaning;
      break;
  }
  return dayjs(date).format("ddd, MMM DD");
};

const Order = ({ selected, className, order, ...props }) => {
  const range = toRange(order);

  return (
    <tr className={`${className} ${selected ? "selected" : ""}`} {...props}>
      <td className="order__field">{order.status}</td>
      <td className="order__field">{showRange(range, order.status)}</td>
    </tr>
  );
};

const OrderWrapper = styled(Order)`
  .order__field {
    padding: 0.25rem;
  }

  &.selected {
    border: 1px solid black;
    border-radius: 4px;
  }
`;

export default OrderWrapper;
