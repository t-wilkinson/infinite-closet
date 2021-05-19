import React from "react";
import styled from "styled-components";
import usePlugin from "../utils/usePlugin";

const Order = ({ className, order }) => {
  const plugin = usePlugin();
  console.log(order);

  const ship = () => {
    fetch(plugin.stripe.api + "/orders/ship/" + order.id, {
      method: "POST",
      body: JSON.stringify({
        order,
      }),
    }).catch((err) => console.error(err));
  };

  return (
    <tr className={className}>
      <td className="order__field">
        {order.user.first_name}
        {order.user.last_name}
      </td>
      <td className="order__field">
        {order.payment_intent_json && order.payment_intent_json.amount}
      </td>
      <td className="order__field">Shipping Label</td>
      <td className="order__field order__process">
        <button onClick={process}>Process</button>
      </td>
      <td className="order__field">
        {
          {
            planning: <div />,
            shipping: () => {
              const collectionAddress = Object.keys(order.shipping_json)
                .filter((key) => /^Collection_/.test(key))
                .reduce((acc, key) => {
                  acc[key.replace(/^Collection_/, "")] =
                    order.shipping_json[key];
                }, {});

              return (
                <div>
                  Shipping Label
                  <div className="order__shipping__label">
                    {Object.entries(collectionAddress).map(([k, v]) => (
                      <div key={k}>
                        {k.replace(/_/, " ")} {v}
                      </div>
                    ))}
                  </div>
                </div>
              );
            },
            shipped: <div />,
          }[order.status]
        }
      </td>
    </tr>
  );
};

const OrderWrapper = styled(Order)`
  .order__field {
    padding: 0.25rem;
  }

  .order__process {
    button {
      padding: 0.25rem;
      border: solid #ccc 1px;
      border-radius: 4px;
    }
  }
`;

export default OrderWrapper;
