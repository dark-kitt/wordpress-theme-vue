import { resolve } from 'path';
import { sync } from 'glob';

import { DefinePlugin } from 'webpack';
import { VueLoaderPlugin } from 'vue-loader';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';

import WebpackAssetsManifest from 'webpack-assets-manifest';

import env from './env';

const devMode = env.WEBPACK_MODE === 'development';
const plugins = [
  new VueLoaderPlugin(),
  new MiniCssExtractPlugin({
    filename: devMode ? 'css/[name].bundle.css' : 'css/[name].[contenthash].bundle.min.css',
    chunkFilename: devMode
      ? 'css/chunk/[name].bundle.css'
      : 'css/chunk/[name].[contenthash].bundle.min.css'
  }),
  /** remove unused CSS */
  new PurgeCSSPlugin({
    paths: sync(`${resolve(__dirname, '..', 'src')}/**/*`, { nodir: true }),
    safelist: [],
    blocklist: []
  }),
  new DefinePlugin({ ...env, 'process.env': JSON.stringify(env) }),
  new WebpackAssetsManifest({
    entrypoints: true,
    entrypointsUseAssets: true,
    output: resolve(__dirname, '..', 'www', 'assets-manifest.json'),
    transform(entry) {
      const result = {};
      for (const [key, value] of Object.entries(entry)) {
        // skip entrypoints
        if (key === 'entrypoints') {
          result[key] = value;
          continue;
        }
        // remove typescript *.d.ts files
        if (typeof value === 'string' && !value.includes('@type')) {
          result[key] = value;
        }
      }
      return result;
    }
  })
];

export default plugins;
