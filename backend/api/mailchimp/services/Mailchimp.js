"use strict";

const mailchimp = require("@mailchimp/mailchimp_transactional")(
  process.env.MAILCHIMP_TOKEN
);

module.exports = mailchimp;

const default_message = {
  merge_language: "handlebars",
  from_email: "info@infinitecloset.co.uk",
  from_name: "Infinite Closet",
  subject: "Infinite Closet",
};

// message.to expects [{email, name, type}], not [email]
const normalizeTo = (to) => {
  const res = [];
  if (typeof to === "string") {
    res.push({ email: to });
  } else {
    for (const email in to) {
      if (typeof email === "string") {
        res.push({ email });
      } else {
        res.push(email);
      }
    }
  }
  return res;
};

const normalizeMessage = (message) => {
  return { ...default_message, ...message, to: normalizeTo(message.to) };
};

// TODO: use more intuitive global_merge_vars? `{name: content}`
module.exports = {
  async send(message) {
    return await mailchimp.messages.send({
      message: normalizeMessage(message),
    });
  },

  async template(template_name, message) {
    return await mailchimp.messages.sendTemplate({
      template_name,
      template_content: [],
      message: normalizeMessage(message),
    });
  },
};
