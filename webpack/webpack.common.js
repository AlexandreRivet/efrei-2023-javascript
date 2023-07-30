const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  stats: 'none',
  output:
  {
    filename: 'bundle.[fullhash].js',
    path: path.resolve(__dirname, '../dist'),
  },
  plugins:
  [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: ['libs', 'subcontent'].map((dirName) => ({
        from: path.resolve(__dirname, `../src/${dirName}`),
        to: path.resolve(__dirname, `../dist/${dirName}`),
      }))
    }),
  ],
  module:
  {
    rules:
    [
      // HTML
      {
        test: /\.(html)$/,
        use: ['html-loader']
      },
      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // SCSS
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ]
  }
}