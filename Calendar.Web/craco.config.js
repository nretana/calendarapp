const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      webpackConfig.resolve.plugins = [
        ...(webpackConfig.resolve.plugins || []),
        new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
      ];
      return webpackConfig;
    },
  },
};