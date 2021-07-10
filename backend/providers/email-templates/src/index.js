import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const orderData = {
  firstName: "First Name",
  price: 30.13,
  size: "MD",
  range: { start: "8/24/2020", end: "8/28/2020" },
  product: {
    name: "Product",
    designer: {
      name: "Designer",
    },
    images: [
      {
        url: "https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg",
        alternativeText: "Alt Text",
      },
    ],
  },
};

const data = {
  "contact-us": {
    firstName: "First Name",
    lastName: "Last Name",
    emailAddress: "Email",
    phoneNumber: "Phone",
    message: "Random message",
  },
  "order-shipping-failure": {
    order: {},
    error: {},
  },
  "forgot-password": {
    url: "REST_URL",
  },
  checkout: {
    firstName: "First Name",
    orders: [orderData, orderData],
    totalPrice: 25,
  },
  "newsletter-subscription": {},
  "waitlist-subscription": {},
  "join-launch-party": {
    firstName: "First Name",
    TICKET_PRICE: 25,
    donation: 25.0,
    discount: 5,
    total: 45,
  },
  "confirm-email-address": {
    url: "URL",
  },
  "order-arriving": orderData,
  "order-leaving": orderData,
};

const Emails = () => {
  const [Email, setEmail] = React.useState();
  const [selected, setSelected] = React.useState(
    Object.keys(data).slice(-1)[0]
  );

  React.useEffect(() => {
    const Email = React.lazy(() => import(`./templates/${selected}`));
    setEmail(Email);
  }, [selected]);

  return (
    <div>
      <nav className="flex-row justify-start space-x-2 border-b border-gray p-2">
        {Object.keys(data).map((k) => (
          <button
            key={k}
            onClick={() => {
              setSelected(k);
              setEmail(undefined);
            }}
          >
            {k}
          </button>
        ))}
      </nav>
      <span style={{ fontWeight: 900 }}>{selected}</span>
      <div>
        {Email && (
          <React.Suspense fallback={<div />}>
            <Email data={data[selected]} />
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<Emails />, document.getElementById("root"));
