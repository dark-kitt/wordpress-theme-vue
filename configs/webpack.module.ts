import { resolve } from 'path';

import autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const module = {
  rules: [
    {
      test: /\.js$/,
      exclude: /\/node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { targets: 'defaults' }]]
        }
      }
    },
    {
      test: /\.vue$/,
      exclude: /\/node_modules/,
      loader: 'vue-loader'
    },
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/]
      }
    },
    {
      test: /\.(sc|c)ss$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: false
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [autoprefixer]
            }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              indentWidth: 2,
              includePaths: [resolve(__dirname, '..', 'styles'), resolve(__dirname, '..', 'assets')]
            },
            sourceMap: true
          }
        }
      ]
    },
    {
      test: /\.(jpg|png|gif|svg|woff(2)|ttf|eot|pdf)$/,
      type: 'asset/resource',
      generator: {
        filename: '[path][name][ext]'
      }
    }
  ]
};

export default module;