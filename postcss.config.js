// https://git.io/vpT75
module.exports = ({ file }) => ({
  plugins: {
    'postcss-import': { root: file.dirname },
    'postcss-url': [
      { filter: './**.*', url: asset => `./${asset.url}` } // [relative path](https://git.io/vplP2)
    ],
    // http://cssnext.io/usage, http://browserl.ist
    'postcss-cssnext': {
      browsers: ['last 2 version']
    },
    // add your "plugins" here
    // ...
    // and if you want to compress,
    // just use css-loader option that already use cssnano under the hood
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
});
