import React from "react";

export default ({ data }) => {
  return (
    <div>
      <p>We heard that you lost your password. Sorry about that!</p>

      <p>
        But don’t worry! You can use the following link to reset your password:
      </p>
      <p>{data.url}</p>

      <p>Thanks.</p>
    </div>
  );
};
