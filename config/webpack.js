const path = require('path')

module.exports = {
  webpack: {
    config: require('../webpack.config'),
    development: { // dev server config
      // webpack: { }, // separate webpack config for the dev server or defaults to the config above
      config: { // webpack-dev-server config
        // This is handy if you are using a html5 router.
        historyApiFallback: true,
        // set value port as 3000,
        // open your browser at http://localhost:3000/ instead of http://localhost:1337/
        // for develop and debug your application
        port: 3000,
        // enable Hot Module Replacement with dev-server
        hot: true,
        // secure
        // https: true,
        // sails.js public path
        contentBase: path.resolve(__dirname, '../.tmp/public'),
        // bypass sails.js server
        proxy: {
          '/api': {
            target: 'http://localhost:1337'
          },
          '/auth': {
            target: 'http://localhost:1337'
          }
        }
      }
    },
    watchOptions: {
      aggregateTimeout: 300
    }
  }
}
