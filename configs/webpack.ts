import { resolve } from 'path';
import { Configuration } from 'webpack';

import WebpackModule from './webpack.module';
import WebpackPlugins from './webpack.plugins';
import WebpackOptimization from './webpack.optimization';

import env from './env';

const devMode = env.WEBPACK_MODE === 'development';
const config: Configuration = {
  mode: env.WEBPACK_MODE,
  entry: ['./src/main.ts', './src/styles/main.scss'],
  output: {
    clean: true,
    publicPath: '/',
    path: resolve(__dirname, '..', 'www'),
    filename: devMode ? 'js/[name].bundle.js' : 'js/[name].[contenthash].bundle.min.js'
  },
  resolve: {
    alias: {
      '@modules': resolve(__dirname, '..', 'src', 'modules'),
      '@components': resolve(__dirname, '..', 'src', 'modules', 'components'),
      '@scripts': resolve(__dirname, '..', 'src', 'scripts'),
      '@styles': resolve(__dirname, '..', 'src', 'styles'),
      '@assets': resolve(__dirname, '..', 'src', 'assets'),
      '@configs': resolve(__dirname, '..', 'src', 'configs'),
      '@store': resolve(__dirname, '..', 'src', 'store')
    },
    extensions: ['.js', '.vue', '.ts']
  },
  devtool: 'source-map',
  watch: !!(env.WEBPACK_MODE === 'development'),
  watchOptions: {
    poll: 500,
    ignored: [
      resolve(__dirname, '..', 'www'),
      resolve(__dirname, '..', 'configs'),
      resolve(__dirname, '..', 'node_modules')
    ]
  },
  performance: {
    hints: env.WEBPACK_MODE === 'development' ? false : 'error',
    // necessary to declare for bigger projects
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  },
  optimization: WebpackOptimization,
  plugins: WebpackPlugins,
  module: WebpackModule
};

export default config;
