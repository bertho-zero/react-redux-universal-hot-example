// require('@babel/polyfill');

// Webpack config for creating the production bundle.
const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: ['bootstrap-loader', './src/client.js']
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    publicPath: '/dist/'
  },
  performance: {
    hints: false
  },
  optimization: {
    // for MiniCssExtractPlugin:
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(less|scss)$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules(\/|\\)(?!(@feathersjs))/
      },
      {
        test: /\.less$/,
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: 'postcss.config.js'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true,
              sourceMapContents: true
            }
          },
        ]
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: {
          limit: 10240
        }
      }
    ]
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      Tether: 'tether',
      'window.Tether': 'tether',
      Popper: ['popper.js', 'default'],
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
    }),
    /* wepack build status - show webpack build progress in terminal */
    new webpack.ProgressPlugin(),

    new CleanPlugin(),

    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
      allChunks: true
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',

      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    webpackIsomorphicToolsPlugin,

    new ReactLoadablePlugin({
      filename: path.join(assetsPath, 'loadable-chunks.json')
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pwa.js'
    }),

    new SWPrecacheWebpackPlugin({
      cacheId: 'react-redux-universal-hot-example',
      filename: 'service-worker.js',
      maximumFileSizeToCacheInBytes: 8388608,

      // Ensure all our static, local assets are cached.
      staticFileGlobs: [`${path.dirname(assetsPath)}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}`],
      stripPrefix: path.dirname(assetsPath),

      directoryIndex: '/',
      verbose: true,
      navigateFallback: '/dist/index.html'
    })
  ]
};
