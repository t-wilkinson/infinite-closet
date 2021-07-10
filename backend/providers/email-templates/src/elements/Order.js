import React from "react";
import Grid from "../layout/Grid";
import Img from "../elements/Img";
import Between from "../elements/Between";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getURL } from "../api";

dayjs.extend(utc);
dayjs.extend(timezone);

const Order = ({ size, price, product, range }) => {
  const formatDate = (date) =>
    dayjs(date).tz("Europe/London").format("dddd, MMM D");

  return (
    <div
      style={{
        padding: 8,
        backgroundColor: "#efefef",
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <Between
        style={{
          left: {
            width: 104,
          },
        }}
        left={
          <Img
            style={{ width: 96, height: 96 }}
            src={getURL(product.images[0].url)}
            alt={product.images[0].alternativeText}
          />
        }
        right={
          <Grid style={{ width: "100%" }}>
            <Grid.Row>
              <Between
                left={
                  <Grid>
                    <Grid.Row style={{ color: "#5f6368" }}>
                      Rental Start:
                    </Grid.Row>
                    <Grid.Row style={{ color: "#39603d", fontWeight: 700 }}>
                      {formatDate(range.start)}
                    </Grid.Row>
                  </Grid>
                }
                right={
                  <Grid>
                    <Grid.Row style={{ color: "#5f6368" }}>
                      Rental End:
                    </Grid.Row>
                    <Grid.Row style={{ color: "#39603d", fontWeight: 700 }}>
                      {formatDate(range.end)}
                    </Grid.Row>
                  </Grid>
                }
              />
            </Grid.Row>
            <Grid.Row>
              <Between
                left={
                  <span className="">
                    <span style={{ fontWeight: 700 }}>{size}</span>{" "}
                    {product.name} by{" "}
                    <span style={{ fontWeight: 700 }}>
                      {product.designer.name}
                    </span>
                  </span>
                }
                right={<div style={{ fontWeight: 700 }}>£{price}</div>}
              />
            </Grid.Row>
          </Grid>
        }
      />
    </div>
  );
};

export default Order;
