import React from "react";
import Layout from "../layout";
import Order from "../elements/Order";

export default ({ data }) => {
  return (
    <Layout title="Order Ending">
      <h3 style={{ margin: 0 }}>Hello {data.name},</h3>
      <span>Hope you enjoyed your order!</span>
      <span>Please expect a service to pick it up around midday today.</span>
      <Order {...data} />
      <span>We hope to see you again soon.</span>
    </Layout>
  );
};
