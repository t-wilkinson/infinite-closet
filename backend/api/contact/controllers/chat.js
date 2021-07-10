'use strict';

// const _ = require('lodash');

module.exports = {
  async contact(ctx) {
    const body = ctx.request.body;

    await strapi.services.mailchimp.template('contact-us', {
      to: 'info@infinitecloset.co.uk',
      subject: `[Contact] ${body.firstName} ${body.lastName}`,
      global_merge_vars: {
        firstName: body.firstName,
        lastName: body.lastName,
        emailAddress: body.emailAddress,
        phoneNumber: body.phoneNumber,
        message: body.message,
      },
    });

    await strapi.query('contact').create({
      contact: body.email,
      context: 'contact',
      metadata: {
        firstName: body.firstname,
        lastName: body.lastName,
        email: body.emailAddress,
        phoneNumber: body.phoneNumber,
      },
    });
  },
};

// const fetch = require("node-fetch");
// const WebSocket = require("ws");

// const wss = new WebSocket.Server({
//   port: 8080,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       // See zlib defaults.
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3,
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024,
//     },
//     // Other options settable:
//     clientNoContextTakeover: true, // Defaults to negotiated value.
//     serverNoContextTakeover: true, // Defaults to negotiated value.
//     serverMaxWindowBits: 10, // Defaults to negotiated value.
//     // Below options specified as default values.
//     concurrencyLimit: 10, // Limits zlib concurrency for perf.
//     threshold: 1024, // Size (in bytes) below which messages
//     // should not be compressed.
//   },
// });

// const slackConfig = {
//   channel: "C017G6ES2CE",
// };

// const slack = async ({ path, body = {}, method = "POST" }) => {
//   if (method === "POST") {
//     return fetch(`https://slack.com/api/${path}`, {
//       method,
//       headers: {
//         "Content-Type": "application/json; charset=utf-8",
//         Authorization: "Bearer " + process.env.SLACK_USER_OAUTH_TOKEN,
//       },
//       body: JSON.stringify({ ...body, ...slackConfig }),
//     }).then((res) => res.json());
//   } else {
//     return fetch(
//       `https://slack.com/api/${path}?token=${process.env.SLACK_BOT_OAUTH_TOKEN}`,
//       {
//         method,
//         headers: {
//           "Content-type": "application/x-www-form-urlencoded",
//           Authorization: "Bearer " + process.env.SLACK_BOT_OAUTH_TOKEN,
//         },
//       }
//     ).then((res) => res.json());
//   }
// };
