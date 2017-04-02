# React Hot Module Replacement with Rails

This is a simple demo of how to get Rails and Webpack configured for React Hot Module Replacement (HMR).

## Steps

1. Add `webpack-dev-server` and `react-hot-loader` (> v 3.0) as npm dev dependencies.
  - `npm install --save-dev webpack-dev-server react-hot-loader@3.0.0-beta.6`
2. Add hot-loader and devServer settings to `webpack.config.js`.
  ```js
  // webpack.config.js
  var path = require("path")
  var webpack = require("webpack")

  module.exports = {
    context: __dirname,
    // each is loaded as a module
    entry: [
      'react-hot-loader/patch', // hmr module
      'webpack-dev-server/client?http://0.0.0.0:8080', // webpack-dev-server module
      'webpack/hot/only-dev-server', // webpack-dev-server hot reloading module
      path.join(__dirname, 'frontend', 'index.jsx') // our frontend code module
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'app', 'assets', 'javascripts')
    },
    module: {
      loaders: [{
          test: [/\.jsx?$/],
          exclude: /node_modules/,
          // make sure 'react-hot-loader/webpack' goes first as these are loaded in order
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
      // specifies that 'module.hot === true'
      hot: true,
      // serves these files
      contentBase: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
      // at this path
      publicPath: 'http://localhost:8080/javascripts',
      // allows localhost to localhost requests
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      }
    }
  }
  ```
3. Include React Hot Loader in entry file
  ```js
  // index.jsx

  // import AppContainer
  import { AppContainer } from 'react-hot-loader'

  // define a render method to be called on hot-reload
  // make sure to wrap your root component in 'AppContainer'
  const render = () =>
    ReactDOM.render(<AppContainer><Root /></AppContainer>,
      document.getElementById('root'))

  // initialize rendering
  render()

  // give hotloader component to watch and the render callback
  if (module.hot) module.hot.accept('./Root', render)
  ```
4. Add `bundle.js` to Rails application layout
  ```html
  <!-- app/views/layouts/application.html.erb -->
  <!DOCTYPE html>
  <html>
    <head>
      <title>RailsHmrDemo</title>
      <%= csrf_meta_tags %>

      <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track': 'reload' %>
      <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
      <%= javascript_include_tag 'bundle' %>
    </head>

    <body>
      <%= yield %>
    </body>
  </html>
  ```
5. Add asset host to development environment
  ```ruby
  # config/environments/development
  Rails.application.configure do
    # other config ...

    # Hot-reloading of bundle files
    config.action_controller.asset_host = Proc.new { |source|
      if source =~ /bundle\.js$/i
        "http://localhost:8080"
      end
    }
  end
  ```
