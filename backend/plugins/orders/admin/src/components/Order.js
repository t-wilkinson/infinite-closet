import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

const showRange = (ranges, status) => {
  let date;
  // prettier-ignore
  switch (status) {
    case "planning": date = ranges.start; break;
    case "shipping": date = ranges.returning; break;
    case "cleaning": date = ranges.cleaning; break;
  }
  return dayjs(date).format("ddd, MMM DD");
};

const Order = ({ selected, className, order, ...props }) => {
  const [range, setRange] = React.useState();
  console.log(range);

  React.useEffect(() => {
    fetch(
      `${strapi.backendURL}?date=${order.date}&length=${order.rentalLength}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) => setRange(res.range));
  }, []);

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
