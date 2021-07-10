import React from "react";

export default ({ data }) => {
  return (
    <div>
      <p>Thank you for registering!</p>

      <p>
        You have to confirm your email address. Please click on the link below.
      </p>

      <p>{data.url}</p>

      <p>Thanks.</p>
    </div>
  );
};
