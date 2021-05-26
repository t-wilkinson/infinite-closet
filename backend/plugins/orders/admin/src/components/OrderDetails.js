import React from "react";
import styled from "styled-components";

// TODO: should be planning, shipping, cleaning
const OrderStatus = {
  planning: ({ update, order }) => {
    const ship = () => {
      fetch(strapi.backendURL + "/orders/ship/" + order.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      })
        .then(() => update())
        .catch((err) => console.error(err));
    };

    return (
      <div className="process">
        <div>
          {order.product.name} by{" "}
          {order.product.designer && order.product.designer.name}
        </div>
        <div>
          <span className="process__label">Size:</span> {order.size}
        </div>
        <button onClick={ship}>Ship</button>
      </div>
    );
  },

  shipping: ({ order, update }) => {
    const complete = () => {
      fetch(strapi.backendURL + `/orders/cleaning/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      })
        .then(() => update())
        .catch((err) => console.error(err));
    };

    return (
      <div className="recieving">
        <button onClick={complete}>Recieved Order</button>
      </div>
    );
  },

  cleaning: ({ order, update }) => {
    const complete = () => {
      fetch(strapi.backendURL + `/orders/complete/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      })
        .then(() => update())
        .catch((err) => console.error(err));
    };

    return (
      <div className="cleaning">
        <button onClick={complete}>Complete Order</button>
      </div>
    );
  },
};

const OrderDetails = ({ className, order, update }) => {
  const Status = OrderStatus[order.status];
  return (
    <div className={className}>
      <Status order={order} update={update} />
    </div>
  );
};

const OrderDetailsWrapper = styled(OrderDetails)`
  button {
    margin-top: 8px;
    padding: 0.25rem 1rem;
    border-radius: 2px;
    background: #ddd;
  }

  .process,
  .recieving,
  .cleaning {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .process {
    button {
      margin-top: 8px;
      padding: 0.25rem 1rem;
      border-radius: 2px;
      background: #ddd;
    }

    .process__label {
      // font-weight: 700;
    }
  }

  .recieving {
  }

  .cleaning {
  }
`;
export default OrderDetailsWrapper;
