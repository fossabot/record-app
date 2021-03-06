/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

const webpack = require('webpack')
const project = require('./project.config')
const nib = require('nib')
const path = require('path')

module.exports = {
  output: {
    publicPath: '/assets/',
    path: path.resolve(__dirname, '../dist/assets/'),
    filename: 'main.js'
  },
  devtool: false,
  entry: [
    'whatwg-fetch',
    'babel-polyfill',
    './src/index.js'
  ],
  stats: {
    colors: true,
    reasons: false
  },
  plugins: [
    new webpack.DefinePlugin(project.globals),
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(styl|css)$/,
      use: [{
	loader: 'style-loader'
      }, {
	loader: 'css-loader',
      }, {
	loader: 'stylus-loader',
	options: {
	  use: [nib()],
	  import: [
	    '~nib/lib/nib/index.styl',
	    path.resolve(__dirname, '../src/styles/variables.styl')
	  ]
	}
      }]
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }]
  }
}
