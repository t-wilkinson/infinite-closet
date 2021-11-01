const transactional = require('./utils/transactional')
const marketing = require('./utils/marketing')

module.exports = {
  ...transactional,
  ...marketing,
}
