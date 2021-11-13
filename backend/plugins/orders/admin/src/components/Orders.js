import React from "react";
import Order from "./Order";
import OrderDetails from "./OrderDetails";
import styled from "styled-components";
import { OrdersContext } from "./utils";

const Orders = ({ className }) => {
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, selectOrder] = React.useState(0);

  const getOrders = () => {
    // fetch orders
    // also fetch respective product designer because it is not included
    fetch(strapi.backendURL + "/orders?status_in=planning&status_in=cleaning", {
      method: "GET",
    })
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
                item.product.designer = res[0];
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
      <HeadingWrapper />
      <main>
        <OrdersContext.Provider value={{ orders, setOrders, getOrders }}>
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
              <OrderDetails update={getOrders} order={orders[selectedOrder]} />
            )}
          </div>
        </OrdersContext.Provider>
      </main>
    </div>
  );
};

const OrdersWrapper = styled(Orders)`
  height: 100%;
  padding: 18px 30px 66px 30px;

  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }

  table {
    box-shadow: 0 2px 4px #e3e9f3;
    border-radius: 3px;

    thead {
      background: #f3f3f3;
      color: black;
      font-weight: 800;
      font-size: 1.3rem;
    }

    td {
      padding: 0 25px;
    }

    tbody td {
      border-top: 1px solid #f1f1f2 !important;
    }

    tbody tr:hover {
      background-color: #f7f8f8;
      cursor: pointer;
    }
  }

  .details {
  }
`;

const Header = ({ className }) => (
  <thead className={className}>
    <tr className="header__tr">
      <td className="header__td">id</td>
      <td className="header__td">Customer name</td>
      <td className="header__td">Status</td>
      <td className="header__td">Next action</td>
      <td className="header__td">Start date</td>
      <td className="header__td"></td>
    </tr>
  </thead>
);

const HeaderWrapper = styled(Header)`
  .header__tr {
  }

  .header__td {
    padding: 1rem;
  }
`;

const Heading = ({ className }) => (
  <div className={className}>
    <h1>Orders</h1>
  </div>
);

const HeadingWrapper = styled(Heading)`
  h1 {
    font-size: 2.4rem;
    font-weight: 600;
    padding: 0.5rem;
  }
`;

export default OrdersWrapper;
