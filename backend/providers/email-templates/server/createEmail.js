const fs = require('fs')
const path = require('path')

const React = require('react')
const ReactDOMServer = require('react-dom/server')

const STYLE_TAG = '%STYLE%'
const CONTENT_TAG = '%CONTENT%'

function createEmail(Email, data) {
  return Promise.all([
    getFile('../src/styles.css'),
    getFile('./email.html'),
  ]).then(([style, template]) => {
    const emailElement = React.createElement(Email, { data })
    const content = ReactDOMServer.renderToStaticMarkup(emailElement)

    // Replace the template tags with the content
    let emailHTML = template
    emailHTML = emailHTML.replace(CONTENT_TAG, content)
    emailHTML = emailHTML.replace(STYLE_TAG, style)

    return emailHTML
  })
}

function getFile(relativePath) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, relativePath)

    return fs.readFile(filePath, { encoding: 'utf8' }, (err, file) => {
      if (err) return reject(err)
      return resolve(file)
    })
  })
}

const templates = path.join(__dirname, 'build', 'templates')

module.exports = async function (template, data) {
  template = await require(path.join(templates, template + '.js')).default
  return await createEmail(template, data)
}

