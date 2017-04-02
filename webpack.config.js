var path = require("path")
var webpack = require("webpack")

module.exports = {
  context: __dirname,
  entry: [ 
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'frontend', 'index.jsx')
  ], 
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
    publicPath: path.resolve(__dirname, 'app', 'assets', 'javascripts')
  },
  module: {
    loaders: [{
        test: [/\.jsx?$/],
        exclude: /node_modules/,
        loaders: ['react-hot-loader/webpack', 'babel-loader'],
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devtool: 'source-maps',
  resolve: {
    extensions: [".js", ".jsx", "*"],
  },
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
    publicPath: 'http://localhost:8080/javascripts',
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }
  }
}
