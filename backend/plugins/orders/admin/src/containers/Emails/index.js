/**
 * @file Enable admin to send emails that are normally hidden behind rest api
 */
import React from "react";
import { Switch, Route } from "react-router-dom";
import { Label, InputNumber, Button } from "strapi-helper-plugin";
import styled from "styled-components";

import Wrapper from "./Wrapper";
import pluginId from "../../pluginId";

const Emails = () => {
  // const location = useLocation();
  // const path = location.pathname.split("/").slice(-1)
  const path = (subpath) => `/plugins/${pluginId}/emails/${subpath}`;

  return (
    <Wrapper>
      <Switch>
        <Route
          path={path("rental-ending")}
          component={() => <SendEmail slug="order-leaving" />}
        />
        <Route
          path={path("send-cleaners")}
          component={() => <SendEmail slug="order-cleaners" />}
        />
      </Switch>
    </Wrapper>
  );
};

const SendEmail = ({ slug }) => {
  const [orderId, setOrderId] = React.useState();
  const [status, setStatus] = React.useState({ code: null, message: null });
  const onSubmit = (e) => {
    e.preventDefault();
    fetch(`${strapi.backendURL}/emails/${slug}/${orderId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message);
        } else {
          return res.json();
        }
      })
      .then((res) => {
        setStatus({ code: "success", message: "Successfully sent mail" });
      })
      .catch((err) => {
        setStatus({
          code: "error",
          message: `Failure sending mail\n${err.message}`,
        });
        console.error(err);
      });
  };

  return (
    <RentalEndingWrapper>
      <div>
        <form onSubmit={onSubmit}>
          <fieldset>
            <Label message="Order id"></Label>
            <InputNumber
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              name="order-id"
            />
          </fieldset>
          <Button style={{ marginTop: "1rem" }} type="submit" primary={true}>
            Send email
          </Button>
        </form>
        {status.code === "success" ? (
          <span>{status.message}</span>
        ) : status.code === "error" ? (
          <span style={{ color: "red" }}>{status.message}</span>
        ) : null}
      </div>
    </RentalEndingWrapper>
  );
};

const RentalEndingWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default Emails;
