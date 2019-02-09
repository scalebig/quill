const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pkg = require('../package.json');
const webpackShared = require('./webpack-shared');

const bannerPack = new webpack.BannerPlugin({
  banner: [
    `Quill Editor v${pkg.version}`,
    'https://quilljs.com/',
    'Copyright (c) 2014, Jason Chen',
    'Copyright (c) 2013, salesforce.com',
  ].join('\n'),
  entryOnly: true,
});
const constantPack = new webpack.DefinePlugin({
  QUILL_VERSION: JSON.stringify(pkg.version),
});

const source = [
  'quill.js',
  'core.js',
  'blots',
  'core',
  'formats',
  'modules',
  'test',
  'themes',
  'ui',
].map(file => {
  return path.resolve(__dirname, '..', file);
});

const jsRules = {
  test: /\.js$/,
  include: source,
  use: webpackShared.module.rules[0].use,
};

const svgRules = {
  test: /\.svg$/,
  include: [path.resolve(__dirname, '../assets/icons')],
  use: [
    {
      loader: 'html-loader',
      options: {
        minimize: true,
      },
    },
  ],
};

const stylRules = {
  test: /\.styl$/,
  include: [path.resolve(__dirname, '../assets')],
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
};

const tsRules = {
  test: /\.ts$/,
  use: [
    {
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          declaration: false,
          module: 'es6',
          sourceMap: true,
          target: 'es6',
        },
        transpileOnly: true,
      },
    },
  ],
};

const baseConfig = {
  mode: 'development',
  context: path.resolve(__dirname, '..'),
  entry: {
    'quill.js': ['./quill.js'],
    'quill.core.js': ['./core.js'],
    'quill.core': './assets/core.styl',
    'quill.bubble': './assets/bubble.styl',
    'quill.snow': './assets/snow.styl',
    'unit.js': './test/unit.js',
  },
  output: {
    filename: '[name]',
    library: 'Quill',
    libraryExport: 'default',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, '../dist/'),
  },
  resolve: {
    alias: {
      parchment: path.resolve(
        __dirname,
        '../node_modules/parchment/src/parchment',
      ),
    },
    extensions: ['.js', '.styl', '.ts'],
  },
  module: {
    rules: [jsRules, stylRules, svgRules, tsRules],
    noParse: [
      /\/node_modules\/clone\/clone\.js$/,
      /\/node_modules\/eventemitter3\/index\.js$/,
      /\/node_modules\/extend\/index\.js$/,
    ],
  },
  plugins: [
    bannerPack,
    constantPack,
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new webpack.ProvidePlugin({
      'window.Quill': 'quill/dist/quill.js',
      Quill: 'quill/dist/quill.js',
      // 'window.katex': 'katex/dist/katex.js',
      // 'katex': 'katex/dist/katex.js'
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    hot: false,
    port: process.env.npm_package_config_ports_webpack,
    stats: 'minimal',
    disableHostCheck: true,
  },
};

module.exports = env => {
  if (env && env.minimize) {
    const { devServer, ...prodConfig } = baseConfig;
    const config = {
      ...prodConfig,
      mode: 'production',
      entry: { 'quill.min.js': './quill.js' },
      devtool: 'source-map',
    };
    return config;
  }
  if (env && env.coverage) {
    baseConfig.module.rules[0].use[0].options.plugins = ['istanbul'];
    return baseConfig;
  }
  return baseConfig;
};
