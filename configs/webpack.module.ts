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
      exclude: /\/node_modules/,
      options: {
        /**
         * ts-loader can only type check post-transform code.
         * This doesn't align with the errors we see in IDEs or from vue-tsc,
         * which map directly back to the source code.
         *
         * We already have type checking running right in our IDE in a separate process,
         * so the cost of dev experience slow down simply isn't a good trade-off.
         * https://vuejs.org/guide/typescript/overview#note-on-vue-cli-and-ts-loader
         *
         * That's why we use in this case the transpileOnly option.
         * https://github.com/TypeStrong/ts-loader?tab=readme-ov-file#transpileonly
         */
        transpileOnly: true,
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
              includePaths: [resolve(__dirname, '..', 'src', 'assets')]
            },
            sourceMap: true
          }
        }
      ]
    },
    {
      test: /\.(jpg|png|gif|svg|woff(2)|ttf|eot|pdf)$/,
      resourceQuery: { not: [/raw/] },
      type: 'asset/resource',
      generator: {
        filename: chunk => chunk.filename.replace('src/', '')
      }
    },
    {
      /**
       * Previously achievable by using raw-loader
       *
       * import raw SVG file structure by using
       * the ?raw query to inline the source object
       *
       * e.g.
       * import SVG from 'path/to/icon.svg?raw'
       */
      test: /\.svg$/,
      resourceQuery: /raw/,
      type: 'asset/source'
    }
  ]
};

export default module;
