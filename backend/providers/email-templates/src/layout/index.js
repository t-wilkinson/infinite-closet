import React from "react";

import Img from "../elements/Img";
import Grid from "./Grid";
import Footer from "../elements/Footer";

export const Layout = ({ title, children }) => (
  <div
    style={{
      width: "100%",
      background: "#efefef",
      paddingTop: 16,
      paddingBottom: 16,
    }}
  >
    <Grid style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <Grid.Row>
        <Grid>
          <Grid.Row>
            <Img
              style={{
                height: 128,
                width: 256,
                objectFit: "cover",
              }}
              src="https://infinitecloset.co.uk/media/brand/logo-lockup-gray-transparent.png"
            />
            <Grid.Cell
              style={{ fontSize: 20, fontWeight: 700, textAlign: "right" }}
            >
              {title}
            </Grid.Cell>
          </Grid.Row>
        </Grid>
      </Grid.Row>
      <Grid.Row style={{ width: "100%", background: "white" }}>
        <div style={{ margin: 16 }}>
          <Grid style={{ width: "100%" }}>{children}</Grid>
        </div>
      </Grid.Row>
      <Footer />
    </Grid>
  </div>
);
export default Layout;
