import { resolve } from 'path';
import { Configuration } from 'webpack';

import WebpackModule from './webpack.module';
import WebpackPlugins from './webpack.plugins';
import WebpackOptimization from './webpack.optimization';

import env from './env';

const devMode = env.WEBPACK_MODE === 'development';
const config: Configuration = {
  mode: env.WEBPACK_MODE,
  entry: ['./main.ts', './styles/main.scss'],
  output: {
    clean: true,
    publicPath: '/',
    path: resolve(__dirname, '..', 'www'),
    filename: devMode ? 'js/[name].bundle.js' : 'js/[name].[contenthash].bundle.min.js'
  },
  resolve: {
    alias: {
      '@modules': resolve(__dirname, '..', 'modules'),
      '@components': resolve(__dirname, '..', 'modules', 'components'),
      '@scripts': resolve(__dirname, '..', 'scripts'),
      '@styles': resolve(__dirname, '..', 'styles'),
      '@assets': resolve(__dirname, '..', 'assets'),
      '@configs': resolve(__dirname, '..', 'configs')
    },
    extensions: ['.vue', '.ts', '.js']
  },
  devtool: 'source-map',
  watch: !!(env.WEBPACK_MODE === 'development'),
  watchOptions: {
    poll: 500,
    ignored: [
      resolve(__dirname, '..', 'node_modules'),
      resolve(__dirname, '..', 'configs'),
      resolve(__dirname, '..', '@types'),
      resolve(__dirname, '..', 'www')
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
