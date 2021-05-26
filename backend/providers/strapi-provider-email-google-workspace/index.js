"use strict";
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const _ = require("lodash");

/**
 * Module dependencies
 */

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");

  var encodedMail = Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return encodedMail;
}

const gmail = {
  init(options) {
    const JWT = google.auth.JWT;
    const authClient = new JWT({
      keyFile: path.resolve(__dirname, "credentials.json"),
      scopes: [
        "https://mail.google.com",
        "https://www.googleapis.com/auth/gmail.compose",
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.readonly",
      ],
      subject: options.subject,
    });
    authClient.authorize();

    return {
      auth: authClient,
      send({ to, from, subject, html }) {
        const raw = makeBody(to, from, subject, html);
        const gmail = google.gmail({ version: "v1", auth: this.auth });

        gmail.users.messages
          .send({
            auth: this.auth,
            userId: "me",
            resource: { raw },
          })
          .catch(() => {});
      },
    };
  },
};

const emailFields = [
  "from",
  "replyTo",
  "to",
  "cc",
  "bcc",
  "subject",
  "text",
  "html",
  "attachments",
];

module.exports = {
  provider: "google-workspace",
  name: "Google Workspace",
  init: (providerOptions = {}, settings = {}) => {
    const client = gmail.init(providerOptions);

    return {
      template(options = {}, { subject, filename } = {}, data = {}) {
        subject = _.template(subject, data);
        let html = fs.readFileSync(path.resolve(__dirname, filename), "utf8");
        html = _.template(html, data);
        return this.send({ ...options, subject, html });
      },

      send(options) {
        const emailOptions = {
          ..._.pick(options, emailFields),
          from: options.from || settings.defaultFrom,
          replyTo: options.replyTo || settings.defaultReplyTo,
          html: options.html || options.text,
        };

        strapi.log.info("email:send -> %o", emailOptions);
        return client.send(emailOptions);
      },
    };
  },
};
