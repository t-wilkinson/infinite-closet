"use strict";

const fetch = require("node-fetch");

// TODO: hardcode settings for now
const hived = {
  parcels: "https://api.airtable.com/v0/appDFURl2nEJd1XEF/Parcels",
  postcodes: "https://api.airtable.com/v0/app5ZWdAtj21xnZrh/Postcodes",
  key: "keyzCmMhMH9fvKBPV",
};

module.exports = {
  async verify(ctx) {
    const {postcode} = ctx.params;
    const res = await fetch(hived.postcodes, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + hived.key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Recipient_Postcode: postcode,
        }
      })
    });
    const resJSON = await res.json()
    const valid = resJSON.fields.Address_in_delivery_Area === "Valid"

    ctx.send({
      valid
    })
  }
}
