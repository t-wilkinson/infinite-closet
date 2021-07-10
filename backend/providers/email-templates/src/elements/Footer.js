import React from "react";

import Grid from "../layout/Grid";

function Footer() {
  return (
    <Grid
      style={{
        marginTop: 16,
        fontSize: 14,
        color: "#5f6368",
        textAlign: "center",
      }}
    >
      <a style={{ color: "#3b82f6" }} href="https://infinitecloset.co.uk">
        https://InfiniteCloset.co.uk
      </a>
    </Grid>
  );
}

export default Footer;
