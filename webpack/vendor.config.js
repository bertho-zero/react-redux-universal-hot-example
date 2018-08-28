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
      // webpack --config webpack/dev.config.js --display-modules | egrep -o '@babel/runtime/\S+' | sed 's/\.js$//' | sort | uniq

      // <babel-runtime>
      '@babel/runtime/core-js/object/assign.js',
      '@babel/runtime/core-js/object/create.js',
      '@babel/runtime/core-js/object/define-property.js',
      '@babel/runtime/core-js/object/entries.js',
      '@babel/runtime/core-js/object/get-own-property-descriptor.js',
      '@babel/runtime/core-js/object/get-own-property-symbols.js',
      '@babel/runtime/core-js/object/keys.js',
      '@babel/runtime/core-js/object/values.js',
      '@babel/runtime/helpers/arrayWithHoles.js',
      '@babel/runtime/helpers/arrayWithoutHoles.js',
      '@babel/runtime/helpers/assertThisInitialized.js',
      '@babel/runtime/helpers/asyncToGenerator.js',
      '@babel/runtime/helpers/classCallCheck.js',
      '@babel/runtime/helpers/createClass.js',
      '@babel/runtime/helpers/defineProperty.js',
      '@babel/runtime/helpers/esm/extends.js',
      '@babel/runtime/helpers/esm/inheritsLoose.js',
      '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js',
      '@babel/runtime/helpers/extends.js',
      '@babel/runtime/helpers/getPrototypeOf.js',
      '@babel/runtime/helpers/inherits.js',
      '@babel/runtime/helpers/inheritsLoose.js',
      '@babel/runtime/helpers/interopRequireDefault.js',
      '@babel/runtime/helpers/interopRequireWildcard.js',
      '@babel/runtime/helpers/iterableToArray.js',
      '@babel/runtime/helpers/iterableToArrayLimit.js',
      '@babel/runtime/helpers/nonIterableRest.js',
      '@babel/runtime/helpers/nonIterableSpread.js',
      '@babel/runtime/helpers/objectSpread.js',
      '@babel/runtime/helpers/objectWithoutProperties.js',
      '@babel/runtime/helpers/objectWithoutPropertiesLoose.js',
      '@babel/runtime/helpers/possibleConstructorReturn.js',
      '@babel/runtime/helpers/setPrototypeOf.js',
      '@babel/runtime/helpers/slicedToArray.js',
      '@babel/runtime/helpers/toConsumableArray.js',
      '@babel/runtime/helpers/typeof.js',
      '@babel/runtime/node_modules/regenerator-runtime/runtime.js',
      '@babel/runtime/node_modules/regenerator-runtime/runtime-module.js',
      '@babel/runtime/regenerator/index.js',
      '@babel/runtime/regenerator/index.js',
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
