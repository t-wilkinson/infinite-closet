'use strict'

const ids = {
  list: {
    production: '0966cdac14',
    development: '90758d5b1b',
    test: '90758d5b1b',
  },
  store: {
    production: 'infinite_closet',
    development: 'infinite_closet_dev',
    test: 'infinite_closet_dev',
  },
}

module.exports = {
  ids: (id, env) => ids[id][env || process.env.NODE_ENV],
}

