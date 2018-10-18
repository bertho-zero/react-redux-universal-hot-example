const path = require('path');
const webpack = require('webpack');

const projectRootPath = path.resolve(__dirname, '../');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    path: path.join(projectRootPath, 'static/dist/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },

  performance: {
    hints: false
  },

  entry: {
    vendor: [
      '@babel/polyfill',

      //
      // Generate this list using the following command against the stdout of
      // webpack running against the source bundle config (dev/prod.js):
      //
      // webpack --config webpack/dev.config.js --display-modules | egrep -o '@babel/runtime-corejs2/\S+' | sed 's/\.js$//' | sort | uniq

      // <babel-runtime>
      '@babel/runtime-corejs2/core-js/array/from.js',
      '@babel/runtime-corejs2/core-js/array/is-array.js',
      '@babel/runtime-corejs2/core-js/get-iterator.js',
      '@babel/runtime-corejs2/core-js/is-iterable.js',
      '@babel/runtime-corejs2/core-js/number/is-integer.js',
      '@babel/runtime-corejs2/core-js/object/assign.js',
      '@babel/runtime-corejs2/core-js/object/create.js',
      '@babel/runtime-corejs2/core-js/object/define-property.js',
      '@babel/runtime-corejs2/core-js/object/entries.js',
      '@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js',
      '@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js',
      '@babel/runtime-corejs2/core-js/object/get-prototype-of.js',
      '@babel/runtime-corejs2/core-js/object/keys.js',
      '@babel/runtime-corejs2/core-js/object/set-prototype-of.js',
      '@babel/runtime-corejs2/core-js/promise.js',
      '@babel/runtime-corejs2/core-js/set-immediate.js',
      '@babel/runtime-corejs2/core-js/symbol/iterator.js',
      '@babel/runtime-corejs2/core-js/symbol.js',
      '@babel/runtime-corejs2/helpers/arrayWithHoles.js',
      '@babel/runtime-corejs2/helpers/arrayWithoutHoles.js',
      '@babel/runtime-corejs2/helpers/assertThisInitialized.js',
      '@babel/runtime-corejs2/helpers/asyncToGenerator.js',
      '@babel/runtime-corejs2/helpers/classCallCheck.js',
      '@babel/runtime-corejs2/helpers/createClass.js',
      '@babel/runtime-corejs2/helpers/defineProperty.js',
      '@babel/runtime-corejs2/helpers/extends.js',
      '@babel/runtime-corejs2/helpers/getPrototypeOf.js',
      '@babel/runtime-corejs2/helpers/inherits.js',
      '@babel/runtime-corejs2/helpers/iterableToArray.js',
      '@babel/runtime-corejs2/helpers/iterableToArrayLimit.js',
      '@babel/runtime-corejs2/helpers/nonIterableRest.js',
      '@babel/runtime-corejs2/helpers/nonIterableSpread.js',
      '@babel/runtime-corejs2/helpers/objectSpread.js',
      '@babel/runtime-corejs2/helpers/objectWithoutProperties.js',
      '@babel/runtime-corejs2/helpers/objectWithoutPropertiesLoose.js',
      '@babel/runtime-corejs2/helpers/possibleConstructorReturn.js',
      '@babel/runtime-corejs2/helpers/setPrototypeOf.js',
      '@babel/runtime-corejs2/helpers/slicedToArray.js',
      '@babel/runtime-corejs2/helpers/toConsumableArray.js',
      '@babel/runtime-corejs2/helpers/typeof.js',
      '@babel/runtime-corejs2/node_modules/regenerator-runtime/runtime.js',
      '@babel/runtime-corejs2/node_modules/regenerator-runtime/runtime-module.js',
      '@babel/runtime-corejs2/regenerator/index.js',
      // </babel-runtime>

      'axios',
      'final-form',
      'multireducer',
      'react',
      'react-bootstrap',
      'react-dom',
      'react-final-form',
      'react-helmet',
      'react-hot-loader',
      'react-redux',
      'react-router',
      'react-router-bootstrap',
      'react-router-redux',
      'redux',
      'serialize-javascript',
      'socket.io-client'
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),

    new webpack.DllPlugin({
      path: path.join(projectRootPath, 'webpack/dlls/[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ]
};
