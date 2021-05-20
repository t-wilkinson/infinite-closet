import React from "react";
import styled from "styled-components";

const Order = ({ className, order }) => {
  return (
    <tr className={className}>
      <td className="order__field">{order.status}</td>
      <td className="order__field order__date">{order.date}</td>
      <td className="order__field">{OrderStatus[order.status](order)}</td>
    </tr>
  );
};

const OrderStatus = {
  cart: () => <div>Cart</div>,
  list: () => <div>List</div>,
  recieved: () => <div />,
  recieving: () => <div />,
  completed: () => <div />,
  planning: (order) => {
    const ship = () => {
      fetch(strapi.backendURL + "/orders/ship/" + order.id, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order,
        }),
      }).catch((err) => console.error(err));
    };

    return <div className="order__process">
      <button onClick={ship}>Process</button>
      <code>{JSON.stringify(order)}</code>
    </div>;
  },
  shipping: (order) => {
    // TODO: show collection on address on click
    // const collectionAddress = Object.keys(order.shipping_json)
    //   .filter((key) => /^Collection_/.test(key))
    //   .reduce((acc, key) => {
    //     acc[key.replace(/^Collection_/, "")] = order.shipping_json[key];
    //   }, {});

    return (
      <div>
        Shipping Label
        <div className="order__shipping__label">
          {/* {Object.entries(collectionAddress).map(([k, v]) => ( */}
          {/*   <div key={k}> */}
          {/*     {k.replace(/_/, " ")} {v} */}
          {/*   </div> */}
          {/* ))} */}
        </div>
      </div>
    );
  },
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
