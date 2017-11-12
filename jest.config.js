module.exports = {
  moduleDirectories: [
    process.env.NODE_PATH,
    'node_modules'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  globals: {
    __CLIENT__: process.env.NODE_PATH === 'src',
    __SERVER__: process.env.NODE_PATH === 'api',
    __DEVELOPMENT__: true,
    __DEVTOOLS__: false, // <-------- DISABLE redux-devtools HERE
    __DLLS__: false
  }
};
