const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  webpack: {
    config: {
      module: {
        rules: [
          // pre loaders

          // {
          //   test: /\.js$/,
          //   exclude: /node_modules/,
          //   enforce: 'pre',
          //   loader: 'standard-loader'
          // },

          // loaders
          {
            test: /\.(css|scss|sass)$/,
            use: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              'sass-loader'
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [['es2015', { modules: false }]],
                plugins: ['syntax-dynamic-import']
              }
            }]
          },
          {
            test: /.html$/,
            loaders: [
              'html-loader'
            ]
          },
          {
            test: /\.(ttf|eot|svg|jpg|jpeg|png|gif)(\?[\s\S]+)?$/, loader: 'file-loader'
          },
          {
            test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader'
          }
        ]
      },
      resolve: {
        modules: [
          'node_modules',
          'src'
        ]
      },
      plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, '../src/index.html')
        }),
        new webpack.HotModuleReplacementPlugin()
      ],
      devtool: 'source-map',
      output: {
        path: path.resolve(__dirname, '../.tmp/public'),
        filename: 'index.js'
      },
      entry: [
        path.resolve(__dirname, '../src/index.js'),
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:3000/'
      ]
    },
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
