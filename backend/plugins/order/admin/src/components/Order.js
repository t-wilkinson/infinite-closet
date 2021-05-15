import React from "react";
import styled from "styled-components";
import usePlugin from "../utils/usePlugin";

const shippingClass = {
  one_day: "One-Day",
  two_day: "2-Day",
  next_day: "Next-Day",
};

const Order = ({ className, order }) => {
  const plugin = usePlugin();
  const { user } = order;
  const { address } = order;

  React.useEffect(() => {
    if (order.status === "shipping" && order.shipping && !order.shipping_json) {
      fetch(plugin.hived.api, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + plugin.hived.key,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          order.shipping_json = res;
        });
    }
  }, [order.status]);

  const process = () => {
    fetch(plugin.hived.api, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + plugin.hived.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Recipient: address.first_name + address.last_name,
          Recipient_Address_Line_1: address.address,
          Recipient_Town: address.town,
          Recipient_Postcode: address.postcode,
          Sender: plugin.hived.sender,
          Value_GBP: order.payment_intent_json.amount,
          Recipient_Email_Address: user.email,
          Recipient_Phone_Number: user.phone_number,
          Shipping_Class: shippingClass[order.shipping_class],
        },
      }),
    })
      .then((res) => res.json())
      .then((res) =>
        // TODO: update order when it updates
        fetch(plugin.stripe.api + "/orders/" + order.id, {
          method: "PUT",
          body: JSON.stringify({
            shipping: res.id,
            status: "shipping",
          }),
        })
      )
      .catch((err) => console.error(err));
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
