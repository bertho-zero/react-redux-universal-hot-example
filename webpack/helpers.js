const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HappyPack = require('happypack');

const projectRootPath = path.resolve(__dirname, '../');
const threadPool = HappyPack.ThreadPool({ size: 5 });

function createHappyPlugin(id, loaders) {
  return new HappyPack({
    id,
    loaders,
    threadPool,

    // make happypack more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1'
  });
}

function loadDLLManifest(filePath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(filePath);
  } catch (e) {
    process.env.WEBPACK_DLLS = '0';

    console.error(`========================================================================
  Environment Error
------------------------------------------------------------------------
You have requested to use webpack DLLs (env var WEBPACK_DLLS=1) but a
manifest could not be found. This likely means you have forgotten to
build the DLLs.
You can do that by running:
    yarn build-dlls
The request to use DLLs for this build will be ignored.`);
  }

  return undefined;
}

function installVendorDLL(config, dllName) {
  const manifest = loadDLLManifest(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));

  if (manifest) {
    console.log(`Webpack: will be using the ${dllName} DLL.`);

    config.plugins.push(
      new webpack.DllReferencePlugin({
        context: projectRootPath,
        manifest
      })
    );
  }
}

function isValidDLLs(dllNames, assetsPath) {
  return (Array.isArray(dllNames) ? dllNames : [dllNames]).every(dllName => {
    try {
      // eslint-disable-next-line import/no-dynamic-require
      const manifest = require(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
      const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`), 'utf8');

      if (dll.indexOf(manifest.name) === -1) {
        console.warn(`Invalid dll: ${dllName}`);
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  });
}

module.exports = {
  createHappyPlugin,
  installVendorDLL,
  isValidDLLs
};
