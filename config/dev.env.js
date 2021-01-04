var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_URL: '"http://192.168.1.124:8081"'
  API_URL: '"http://localhost:8888"'
})
