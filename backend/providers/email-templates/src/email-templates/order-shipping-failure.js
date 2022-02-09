import React from "react";

export default ({ data }) => (
  <dl>
    <dt>Order</dt>
    <dd>
      <pre>{JSON.stringify(data.order, null, 4)}</pre>
    </dd>

    <dt>Error</dt>
    <dd>
      <pre>{JSON.stringify(data.error, null, 4)}</pre>
    </dd>
  </dl>
);
