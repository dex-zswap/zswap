const {
  override,
  overrideDevServer
} = require('customize-cra');
const webpack = require('webpack');

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