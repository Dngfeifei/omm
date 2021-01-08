var path = require('path')
var utils = require('./utils')
var config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  externals: {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM',
    // 'antd': 'antd',
    // 'react-router': 'ReactRouter',
    // 'moment': 'moment',
    // 'redux-saga': 'ReduxSaga',
    // 'react-redux': 'ReactRedux'
  },
  entry: {
    app: ['./src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.less'],
    alias: {
      '@': resolve('src'),
      '/components': resolve('src/components'),
      '/page': resolve('src/page'),
      '/common': resolve('src/common'),
      '/assets': resolve('src/assets'),
      '/api': resolve('src/api'),
      '/redux': resolve('src/redux')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: "babel-loader",
            options:{
              plugins: [
                ["import", {
                  "libraryName": "antd",
                  "libraryDirectory": "es",
                  "style": "css"
                }]
              ]
            }
          }
        ],
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
