import React from "react";

export default ({ data }) => (
  <dl>
    <dt>First Name</dt>
    <dd>{data.firstName}</dd>
    <dt>Last Name</dt>
    <dd>{data.lastName}</dd>
    <dt>Email Address</dt>
    <dd>{data.emailAddress}</dd>
    <dt>Phone Number</dt>
    <dd>{data.phoneNumber}</dd>
    <dt>Message</dt>
    <dd>{data.message}</dd>
  </dl>
);
