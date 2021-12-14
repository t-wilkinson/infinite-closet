import React from "react";
import styled from "styled-components";
import { OrdersContext } from "./utils";

export const OrderAction = {
  planning: ({ order }) => {
    const { getOrders } = React.useContext(OrdersContext);
    const ship = () => {
      fetch(`${strapi.backendURL}/orders/ship/${order.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          order,
        }),
      })
        .then(() => getOrders())
        .catch((err) => console.error(err));
    };

    return <OrderActionButton onClick={ship}>Ship</OrderActionButton>;
  },
  cleaning: ({ order }) => {
    const { getOrders } = React.useContext(OrdersContext);

    const complete = () => {
      fetch(strapi.backendURL + `/orders/complete/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      })
        .then(() => getOrders())
        .catch((err) => console.error(err));
    };

    return (
      <OrderActionButton onClick={complete}>Complete Order</OrderActionButton>
    );
  },
};

const OrderActionButton = styled.button`
  padding: 0.25rem 1rem;
  border-radius: 2px;
  background: #007eff;
  color: white;
`;

const OrderStatus = {
  planning: ({ order }) => {
    const Action = OrderAction[order.status];
    return (
      <div className="process">
        <div>
          {order.fullName} {order.email}
        </div>
        <div>
          {order.product.name} by{" "}
          {order.product.designer && order.product.designer.name}
        </div>
        <div>
          <span className="process__label">Size:</span>{" "}
          {order.size.replace("_", "")}
        </div>
        <Action order={order} />
      </div>
    );
  },

  cleaning: ({ order }) => {
    const Action = OrderAction[order.status];

    return (
      <div className="cleaning">
        <Action order={order} />
      </div>
    );
  },
};

const OrderDetails_ = ({ className, order }) => {
  const Status = OrderStatus[order.status];
  return (
    <div className={className}>
      <Status order={order} />
    </div>
  );
};

const OrderDetails = styled(OrderDetails_)`
  color: black;

  button {
    margin-top: 8px;
  }

  .process,
  .recieving,
  .cleaning {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .process {
    .process__label {
    }
  }

  .recieving {
  }

  .cleaning {
  }
`;
export default OrderDetails;
