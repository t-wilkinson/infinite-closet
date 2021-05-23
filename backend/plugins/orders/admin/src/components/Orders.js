import React from "react";
import Order from "./Order";
import OrderDetails from "./OrderDetails";
import styled from "styled-components";

const Orders = ({ plugin, className }) => {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, selectOrder] = React.useState(0);

  const getOrders = () => {
    // fetch orders
    // also fetch respective product designer because it is not included
    fetch(
      strapi.backendURL +
        "/orders?status_in=planning&status_in=shipping&status_in=cleaning",
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((res) =>
        Promise.allSettled(
          res.map((item) =>
            fetch(
              strapi.backendURL + `/designers?id=${item.product.designer}`,
              {
                method: "GET",
              }
            )
              .then((res) => res.json())
              .then((res) => {
                item.product.designer = res[0].designer;
                return item;
              })
          )
        )
      )
      .then((res) => {
        const orders = res.map((settled) => settled.value).filter((v) => v);
        setOrders(orders);
      })
      .catch((err) => console.error(err));
  };

  React.useEffect(() => {
    getOrders();
    if (process.env.NODE_ENV === "production") {
      const timer = window.setInterval(getOrders, 60 * 1000);
      return () => window.clearInterval(timer);
    }
  }, []);

  return (
    <div className={className}>
      <table className="order">
        <HeaderWrapper />
        <tbody>
          {orders.map((order, index) => (
            <Order
              key={order.id}
              order={order}
              selected={selectedOrder === index}
              onClick={() => selectOrder(index)}
            />
          ))}
        </tbody>
      </table>
      <div className="details">
        {orders[selectedOrder] && (
          <OrderDetails order={orders[selectedOrder]} />
        )}
      </div>
    </div>
  );
};

const OrdersWrapper = styled(Orders)`
  display: grid;
  grid-template-columns: 1fr 1fr;

  .order {
    cursor: pointer;
  }
`;

const Header = ({ className }) => (
  <thead className={className}>
    <tr>
      <td className="header__td">Status</td>
      <td className="header__td">Date</td>
    </tr>
  </thead>
);

const HeaderWrapper = styled(Header)`
  background: #ddd;
  font-weight: 800;

  .header__td {
    padding: 0.5rem 0.25rem;
  }
`;

export default OrdersWrapper;
