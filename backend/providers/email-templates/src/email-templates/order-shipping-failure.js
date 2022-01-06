import React from "react";

export default ({ data }) => (
  <dl>
    <dt>Order</dt>
    <dd>
      <code>{JSON.stringify(data.order, null, 4)}</code>
    </dd>

    <dt>Error</dt>
    <dd>
      <code>{JSON.stringify(data.error, null, 4)}</code>
    </dd>
  </dl>
);
