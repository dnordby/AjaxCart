let webpack = require("webpack");
let ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./src/js/app.js",
  output: {
      path: __dirname + '/dist/js',
      filename: "ajaxCart.js"
  },
  module: {
    rules: [
      {
        test: /app\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
          test: /\.js$/,
          loader: 'babel-loader',

          exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.scss.liquid'),
  ]
};
