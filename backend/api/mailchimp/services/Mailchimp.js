"use strict";

const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_TOKEN
);

module.exports = mailchimp;

const default_message = {
  merge_language: "handlebars",
  from_email: "info@infinitecloset.co.uk",
  from_name: "Infinite Closet",
  subject: "",
};

module.exports = {
  send(message) {
    return mailchimp.messages.send({ message });
  },
  template(template_name, message) {
    return mailchimp.messages.sendTemplate({
      template_name,
      template_content: [],
      message: { ...default_message, ...message },
    });
  },
};
