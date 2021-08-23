const {
  override,
  addPostcssPlugins,
  fixBabelImports,
  overrideDevServer
} = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    proxy: {
      '/zswap-api': {
        target: 'https://rpc.testnet.dex.io',
        changeOrigin: true,
        secure: false
      }
    }
  };
};

module.exports = {
  devServer: overrideDevServer(devServerConfig())
}