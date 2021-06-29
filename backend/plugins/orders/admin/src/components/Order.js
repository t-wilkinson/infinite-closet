import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const showRange = (range, status) => {
  let date;
  // prettier-ignore
  switch (status) {
    case "planning": date = range.shipped; break; // when planning, order needs to be shipped
    case "cleaning": date = range.completed; break; // when/after cleaning, order is completed once recieved
  }
  return dayjs(date).format("ddd, MMM DD");
};

const Order = ({ selected, className, order, ...props }) => {
  const [range, setRange] = React.useState();

  React.useEffect(() => {
    fetch(`${strapi.backendURL}/orders/dates/range`, {
      method: "POST",
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((res) => setRange(res.range));
  }, []);

  return (
    <tr className={`${className} ${selected ? "selected" : ""}`} {...props}>
      <td className="order__field">{order.status}</td>
      <td className="order__field">
        {range && showRange(range, order.status)}
      </td>
    </tr>
  );
};

const OrderWrapper = styled(Order)`
  .order__field {
    padding: 0.25rem;
  }

  &.selected {
    border-radius: 4px;
    background: #f3f3f3;
  }
`;

export default OrderWrapper;
