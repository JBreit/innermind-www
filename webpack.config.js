const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const Clean = require('clean-webpack-plugin');
const Html = require('html-webpack-plugin');
const Text = require('extract-text-webpack-plugin');

const marked = require('marked');
const renderer = new marked.Renderer();

const cssimport = require('postcss-import');
const cssmodules = require('postcss-modules');
const simplevars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const cssnext = require('postcss-cssnext');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const pkg = require('./package');

const banner = `
  ${pkg.name} - ${pkg.description}
  Author: ${pkg.author.name}
  Version: ${pkg.version}
  Url: ${pkg.homepage}
  License(s): ${pkg.license}
`;

const dir = {
  dist: path.resolve(`${__dirname}/dist`),
  npm: path.resolve(`${__dirname}/node_modules`),
  src: path.resolve(`${__dirname}/src`),
};

const style = new Text({
  filename: `app/css/[name].css`,
  allChunks: true,
});

const base = {
  context: dir.src,
  entry: {
    app: 'index.js',
  },
  resolve: {
    extensions: ['.css', '.htm', '.html', '.js', '.json', '.scss'],
    modules: [dir.src, dir.npm],
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200000, // int (in bytes)
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: (assetFileName) => {
      return assetFileName.endsWith('.css') || assetFileName.endsWith('.js');
    },
  },
  externals: [],
  target: 'web',
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader',
        },
      },
      {
        test: /\.(md|markdown)$/,
        use: [
          {
            loader: 'html-loader',
            options: {},
          },
          {
            loader: 'markdown-loader',
            options: {
              pendantic: true,
              renderer,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: style.extract([
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ]),
      },
      {
        test: /\.(html|htm)$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
          },
        },
      },
      {
        test: /\.(ico|png|svg|jpeg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    style,
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: (loader) => [
          cssimport({ root: loader.resourcePath }),
          cssmodules({
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            getJSON: (cssFileName, json) => {
              const cssName = path.basename(`${cssFileName}.css`);
              const jsonFileName = path.resolve(`${dir.dist}/app/css/${cssName}.json`);

              fs.writeFileSync(jsonFileName, JSON.stringify(json));
            },
            scopeBehaviour: 'local',
          }),
          simplevars(),
          nested(),
          cssnext({
            dynamic: false,
            include: ['**/*.css', '**/*.scss'],
            browsers: pkg.browserslist,
            warnForDuplicates: true,
          }),
          autoprefixer(pkg.browserslist),
          cssnano(),
        ],
      },
    }),
    new webpack.BannerPlugin(banner),
  ],
};

const dev = {
  devtool: 'eval-source-map',
  plugins: [
    new Html({
      favicon: path.resolve(`${dir.src}/app/img/favicon.ico`),
      title: pkg.title,
      template: path.resolve(`${dir.src}/index.html`),
      inject: 'body',
    }),
  ],
};

const prod = {
  devtool: 'source-map',
  output: {
    path: dir.dist,
    filename: `app/[name].js`,
    sourceMapFilename: 'app/[name].map',
  },
  plugins: [
    new Clean(path.resolve(`${dir.dist}/**/*`), { root: dir.dist }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['webpackJsonp'],
      },
    }),
  ],
};

const environments = { dev, prod };

module.exports = env => merge(base, environments[env]);