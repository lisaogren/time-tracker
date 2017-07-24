const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = {
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
        test: /manifest.json$/,
        loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
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
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html')
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.resolve(__dirname, 'src/sw.js')
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'runtime'
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   output: { comments: false },
    //   compress: { warnings: false, drop_console: true }
    // }),
    // new CompressionPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, '.tmp/public')
  },
  entry: {
    index: path.resolve(__dirname, 'src/index.js'),
    'dev-server': 'webpack/hot/dev-server',
    'dev-server-client': 'webpack-dev-server/client?http://localhost:3000/'
  }
}
