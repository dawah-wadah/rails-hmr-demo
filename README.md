# React Hot Module Replacement and LiveReload Style Injection with Rails

This is a simple demo of how to get Rails and Webpack configured for React Hot Module Replacement (HMR) and setup Guard + LiveReload for live CSS updates.

## Hot Module Replacement

Hot Module Replacement exchanges, adds, or removes modules while an application is running without a page reload. This is really nice for development as it rerenders your component hierarchy whenever a file is changed, but maintains app state (no need to refresh and navigate back to where you were).

The following steps are needed to setup HMR for development:

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

Now to keep webpack watching and HMR hot-reloading, simply run `webpack-dev-server --inline --progress`. I recommend adding this as a script to your `package.json`.

## LiveReload Style Injection

1. Add Guard and LiveReload gems to `development`
  ```ruby
  group :development do
    # other dev gems...

    # live css reloading
    gem 'guard-rails', require: false
    gem 'guard-livereload', require: false
    gem 'rack-livereload'
    gem "rb-fsevent",        :require => false
  end
  ```

2. Initialize `Guardfile`
  - Run `guard init livereload` to generate a Guardfile. The defaults should work just fine.

Now just run `guard exec -P livereload` during development to run style injection.

## Additional Resources
- [Hot Module Replacement - React](https://webpack.js.org/guides/hmr-react/)
- [Lightning-Fast Sass Reloading in Rails](https://mattbrictson.com/lightning-fast-sass-reloading-in-rails)
- [Guard::LiveReload Docs](https://github.com/guard/guard-livereload)
