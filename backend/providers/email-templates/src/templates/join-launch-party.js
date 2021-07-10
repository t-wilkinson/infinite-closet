import React from "react";
import Layout from "../layout";
import Grid from "../layout/Grid";
import Icon from "../elements/Icon";
import Between from "../elements/Between";

const Summary = ({ TICKET_PRICE, discount, donation, total }) => {
  return (
    <Grid>
      <h3 style={{ margin: 0, marginTop: 16 }}>Order Summary</h3>
      <div
        style={{
          height: 2,
          marginBottom: 16,
          backgroundColor: "#5f6368",
        }}
      />

      <Between left="Ticket Price" right={`£${TICKET_PRICE.toFixed(2)}`} />
      <Between left="Promo Discount" right={`-£${discount.toFixed(2)}`} />
      <Between left="Donation" right={`£${donation.toFixed(2)}`} />
      <Between
        style={{ fontWeight: 700 }}
        left="Total"
        right={`£${total.toFixed(2)}`}
      />
    </Grid>
  );
};

const Details = () => (
  <React.Fragment>
    <h3 style={{ margin: 0, marginTop: 16 }}>Launch Party Details</h3>
    <div
      style={{
        height: 2,
        marginBottom: 16,
        backgroundColor: "#5f6368",
      }}
    />

    <div style={{ backgroundColor: "#efefef", padding: 16 }}>
      <Grid>
        <Grid.Row>
          <Icon name="clock" size={20} className="text-gray mr-6 mt-2" />
          <div className="">
            <span>Saturday, August 7, 2021</span>
            <span>8pm to 12am (BST)</span>
          </div>
        </Grid.Row>
        <div style={{ height: 16 }} />
        <Grid.Row>
          <Icon name="pin" size={20} className="text-gray mr-6" />
          44 Great Cumberland Pl, London W1H 7BS
        </Grid.Row>
      </Grid>
    </div>
  </React.Fragment>
);

export default ({ data }) => {
  return (
    <Layout title="Launch Party">
      <h3 style={{ margin: 0 }}>Hello {data.name},</h3>
      <span>You joined our launch party!</span>
      <Details />
      <Summary {...data} />

      <div
        style={{
          height: 2,
          marginTop: 8,
          marginBottom: 16,
          backgroundColor: "#5f6368",
        }}
      />

      <span>
        We are excited to meet you
        {data.donation && (
          <span className="mb-2">
            {" "}
            and thank you for your kind donation of{" "}
            <span className="font-bold">£{data.donation}</span>
          </span>
        )}
        !
      </span>
    </Layout>
  );
};
