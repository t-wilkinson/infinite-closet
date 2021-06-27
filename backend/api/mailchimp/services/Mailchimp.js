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
  async send(message) {
    return await mailchimp.messages.send({ message });
  },
  async template(template_name, message) {
    // message.to expects [{email, name, type}], not [email]
    if (typeof message.to === "string") {
      message.to = [{ email: message.to }];
    } else {
      for (const key in message.to) {
        if (typeof message.to[key] === "string") {
          message.to[key] = { email: message.to[key] };
        }
      }
    }

    return await mailchimp.messages.sendTemplate({
      template_name,
      template_content: [],
      message: { ...default_message, ...message },
    });
  },
};
