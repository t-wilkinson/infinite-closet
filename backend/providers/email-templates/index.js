const fs = require("fs");
const path = require("path");

const React = require("react");
const ReactDOMServer = require("react-dom/server");

const STYLE_TAG = "%STYLE%";
const CONTENT_TAG = "%CONTENT%";

function saveEmail(file, email) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join("build", "emails", file + ".html"), email, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

function createEmail(Email, data) {
  return Promise.all([
    getFile("src/styles.css"),
    getFile("src/email.html"),
  ]).then(([style, template]) => {
    const emailElement = React.createElement(Email, { data });
    const content = ReactDOMServer.renderToStaticMarkup(emailElement);

    // Replace the template tags with the content
    let emailHTML = template;
    emailHTML = emailHTML.replace(CONTENT_TAG, content);
    emailHTML = emailHTML.replace(STYLE_TAG, style);

    return emailHTML;
  });
}

function getFile(relativePath) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, relativePath);

    return fs.readFile(filePath, { encoding: "utf8" }, (err, file) => {
      if (err) return reject(err);
      return resolve(file);
    });
  });
}

const templates = path.join(__dirname, "build", "templates");

// if (require.main === module) {
//   fs.readdir(templates, async (err, files) => {
//     for (let file of files) {
//       if (err) {
//         console.error(err);
//         return;
//       }

//       if (file === "index.js") continue;
//       const template = await require(path.join(templates, file));
//       const data = (template.fetchData && template.fetchData()) || {};
//       const email = await createEmail(template, data);
//       saveEmail(path.basename(file, ".js"), email);
//     }
//   });
// }

module.exports = async function (template, data) {
  template = await require(path.join(templates, template + ".js")).default;
  const email = await createEmail(template, data);
  return email;
};
