import React from "react";
import styled from "styled-components";

// TODO: should be planning, shipping, cleaning
const OrderStatus = {
  planning: (order) => {
    const ship = () => {
      fetch(strapi.backendURL + "/orders/ship/" + order.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      }).catch((err) => console.error(err));
    };

    return (
      <div className="process">
        <div>
          {order.product.name} by {order.product.designer.name}
        </div>
        <div>
          <span className="process__label">Size:</span> {order.size}
        </div>
        <div>
          <span className="process__label">Quantity:</span> {order.quantity}
        </div>
        <button onClick={ship}>Ship</button>
      </div>
    );
  },

  shipping: (order) => {
    const complete = () => {
      fetch(strapi.backendURL + `/orders/complete/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order,
        }),
      }).catch((err) => console.error(err));
    };

    return (
      <div className="recieving">
        <button onClick={complete}>Complete Order</button>
      </div>
    );
  },

  cleaning: (order) => {
    const complete = () => {
      fetch(strapi.backendURL + `/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...order,
          status: "cleaning",
        }),
      }).catch((err) => console.error(err));
    };

    return (
      <div className="cleaning">
        <button onClick={complete}>Complete Order</button>
      </div>
    );
  },
};

const OrderDetails = ({ order, className }) => {
  const Status = OrderStatus[order.status];
  return (
    <div className={className}>
      <Status {...order} />
    </div>
  );
};

const OrderDetailsWrapper = styled(OrderDetails)`
  .process,
  .recieving {
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
    button {
      margin-top: 8px;
      padding: 0.25rem 1rem;
      border-radius: 2px;
      background: #ddd;
    }
  }
`;
export default OrderDetailsWrapper;
