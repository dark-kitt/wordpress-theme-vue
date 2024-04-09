import env from './env';

import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const optimization = {
  minimize: !!(env.WEBPACK_MODE === 'production'),
  minimizer: [
    /** minimizer plugins for production mode */
    new CssMinimizerPlugin({
      test: /\.(sc|c)ss$/,
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true
            },
            /** remove duplicate CSS */
            discardDuplicates: true
          }
        ]
      }
    }),
    new TerserPlugin({
      test: /\.js$/,
      extractComments: false
    })
  ],
  splitChunks: {
    // chunks: 'all', throws error TS2322:
    // Type 'string' is not assignable to type 'RegExp | "all" | "initial" | "async" | ((chunk: Chunk) => boolean)'
    // include all chunks === chunks: 'all'
    chunks: (chunk: { [key: string]: any }) => !!chunk.name,
    automaticNameDelimiter: '-',
    cacheGroups: {
      vue: {
        test: /[\\/]node_modules[\\/](@|)(vue|vuex)[\\/]/,
        name(module) {
          const filename = module.resource.includes('/vuex/') ? 'vuex' : 'vue';
          return `vendor/${filename}`;
        }
      }
    }
  }
};

export default optimization;
