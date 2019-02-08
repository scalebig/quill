const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: [
      '@babel/polyfill',
      'core-js/modules/es7.promise.finally',
      './src/index.jsx',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(__dirname, 'node_modules/react-quill'),
          path.join(__dirname, 'local_modules/app-lib'),
          path.join(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              require('@babel/plugin-proposal-class-properties'),
              require('@babel/plugin-proposal-object-rest-spread'),
            ],
            presets: [
              [
                '@babel/preset-env',
                {
                  shippedProposals: true,
                  useBuiltIns: 'entry',
                  targets: {
                    browsers: ['last 2 versions', 'safari > 8', 'IE >= 11'],
                  },
                  exclude: ['transform-classes'],
                },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.jpe?g$/,
        loader: 'ignore-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              includePaths: [
                path.join(__dirname, 'node_modules'),
                path.join(__dirname, 'src/scss'),
              ],
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: './images/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '*.js', '*.jsx', '*.scss'],
    modules: ['local_modules', 'node_modules', path.resolve(__dirname, 'src')],
  },
};
