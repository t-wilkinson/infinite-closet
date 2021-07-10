import React from "react";
import Layout from "../layout";
import Order from "../elements/Order";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default ({ data }) => {
  const formatDate = (date) =>
    dayjs(date).tz("Europe/London").format("dddd, MMM D");

  return (
    <Layout title="Order Arriving">
      <h3 style={{ margin: 0 }}>Hello {data.firstName},</h3>
      <span>Your order has arrived!</span>
      <Order {...data} />
      <span>
        Please expect the order to be picked up on{" "}
        <span style={{ color: "#39603d" }}>{formatDate(data.range.end)}</span>.
      </span>
    </Layout>
  );
};
