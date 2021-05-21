import React from "react";
import styled from "styled-components";

const rentalLengths = {
  short: 4,
  long: 8,
};

const rentalRange = (order) => {
  let sendDate = new Date(order.date);
  sendDate.setDate(sendDate.getDate() - 1);

  let recieveDate = new Date(order.date);
  recieveDate.setDate(
    recieveDate.getDate() + rentalLengths[order.rentalLength] + 1
  );

  return { planning: sendDate, recieving: recieveDate };
};

const showDate = (dates, status) => {
  // return a more readable date
  let date = dates[status].toString().split(/ /).slice(0, 4);
  date[0] = date[0] + ",";
  date[2] = date[2] + ",";
  date = date.join(" ");
  return date;
};

const Order = ({ className, order, ...props }) => {
  const dates = rentalRange(order);

  return (
    <tr className={className} {...props}>
      <td className="order__field">{order.status}</td>
      <td className="order__field">{showDate(dates, order.status)}</td>
    </tr>
  );
};

const OrderWrapper = styled(Order)`
  .order__field {
    padding: 0.25rem;
  }
`;

export default OrderWrapper;
