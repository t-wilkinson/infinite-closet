import React from "react";
import Order from "./Order";
import styled from "styled-components";

const Orders = ({ plugin, className }) => {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    fetch(strapi.backendURL + "/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setOrders(res);
        return Promise.all(
          res.map((order) =>
            fetch(
              plugin.stripe.api + "/payment_intents/" + order.payment_intent,
              {
                method: "GET",
                headers: {
                  Authorization: "Bearer " + plugin.stripe.key,
                },
              }
            )
              .then((res) => res.json())
              .catch(() => null)
          )
        );
      })
      .then((payment_intents) => {
        setOrders((orders) =>
          orders.map((order, i) => {
            if (payment_intents[i]) {
              return {
                ...order,
                // TODO: there is probably a better solution
                payment_intent_json: payment_intents[i],
              };
            } else {
              return order;
            }
          })
        );
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <table className={className}>
      <HeaderWrapper />
      <tbody>
        {orders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </tbody>
    </table>
  );
};

const OrdersWrapper = styled(Orders)``;

const Header = ({ className }) => (
  <thead className={className}>
    <tr>
      <td className="header__td">Name</td>
      <td className="header__td">Amount</td>
      <td className="header__td">Shipping Label</td>
      <td className="header__td">Process Order</td>
    </tr>
  </thead>
);

const HeaderWrapper = styled(Header)`
  width: 100%;
  background: #ccc;
  font-weight: 800;

  .header__td {
    padding: 0.5rem 0.25rem;
  }
`;

export default OrdersWrapper;
