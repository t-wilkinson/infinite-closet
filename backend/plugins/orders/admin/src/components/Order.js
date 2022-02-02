import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { OrderAction } from "./OrderDetails";

const formatDate = (date) => dayjs(date).format("ddd, MMM DD");

const showRange = (range, status) => {
  let date;
  // prettier-ignore
  switch (status) {
    case 'planning': date = range.shipped; break; // when planning, order needs to be shipped
    case 'cleaning': date = range.completed; break; // when/after cleaning, order is completed once recieved
  }
  return formatDate(date);
};

const Order = ({ selected, className, order, ...props }) => {
  const [range, setRange] = React.useState();
  const Action = OrderAction[order.status];

  React.useEffect(() => {
    fetch(`${strapi.backendURL}/orders/dates/range`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((res) => setRange(res.range));
  }, []);

  return (
    <tr className={`${className} ${selected ? "selected" : ""}`} {...props}>
      <td className="order__field">{order.id}</td>
      <td className="order__field">{`${order.contact?.firstName} ${order.contact?.lastName}` || order.contact?.email || ""}</td>
      <td className="order__field">{order.status}</td>
      <td className="order__field">
        {range && showRange(range, order.status)}
      </td>
      <td className="order__field">{formatDate(order.startDate)}</td>
      <td className="order__field--end">
        <Action order={order} />
      </td>
    </tr>
  );
};

const OrderWrapper = styled(Order)`
  .order__field {
    padding: 1rem;
  }

  .order__field--end {
    text-align: right;
  }

  &.selected {
    border-radius: 4px;
    background: #f3f3f3;
  }
`;

export default OrderWrapper;
