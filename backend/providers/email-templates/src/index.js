import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const order = {
  size: "MD",
  product: {
    name: "Product",
    slug: "product",
    designer: {
      name: "Designer",
      slug: "designer",
    },
    images: [
      {
        url: "https://ci6.googleusercontent.com/proxy/0i_xXUdxzuItZLDm1D_gMnKlbWwQGzeTJkobLx32DdFSHfnxDaJXpXYzol9sUEWpPoykOc9n9Ez5hBZKecHtI8ztei6z6CwJTUC-y2kQgKWzTegtLg8XCg6VZb_vS0pf=s0-d-e1-ft#https://images-na.ssl-images-amazon.com/images/I/81wajOO6mLL._AC_SR80,80_.jpg",
        alternativeText: "Alt Text",
      },
    ],
  },
};

const orderData = {
  order,
  firstName: "First Name",
  totalPrice: 30.13,
  range: { start: "8/24/2020", end: "8/28/2020" },
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
    cart: [orderData, orderData],
    totalPrice: 25,
  },
  "newsletter-subscription": {},
  "waitlist-subscription": {},
  "mailinglist-subscription": {},
  "join-launch-party": {
    firstName: "First Name",
    ticketPrice: 25,
    donation: 25.0,
    discount: 5,
    total: 45,
    guests: ["Bob", "Joe"],
  },
  "order-arriving": orderData,
  "order-leaving": orderData,
  "order-shipped": orderData,
};

const Emails = () => {
  const [Email, setEmail] = React.useState();
  const defaultEmail = Object.keys(data).slice(-1)[0];
  const path = window.location.pathname.split("/")[1];

  React.useEffect(() => {
    const Email = React.lazy(() =>
      import(`./templates/${path || defaultEmail}`)
    );
    setEmail(Email);
  }, []);

  return (
    <div>
      <nav
        style={{
          padding: 4,
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(data)
          .sort()
          .map((k) => (
            <a
              key={k}
              href={`/${k}`}
              style={{
                margin: "0.25rem 0.25rem",
                color: "black",
                textDecoration: "none",
                padding: "4px 8px",
                backgroundColor: "#eee",
                borderRadius: 4,
                fontSize: 14,
              }}
            >
              {k}
            </a>
          ))}
      </nav>
      <div>
        {Email && (
          <React.Suspense fallback={<div />}>
            <Email data={data[path || defaultEmail]} />
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

ReactDOM.render(<Emails />, document.getElementById("root"));
