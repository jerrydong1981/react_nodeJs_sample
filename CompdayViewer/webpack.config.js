var Path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var Webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'production';
var cssOutputPath = isProduction ? 'styles/client.[hash].css' : 'styles/client.css';
var jsOutputPath = isProduction ? 'scripts/client.[hash].js' : 'scripts/client.js';
var ExtractCSS = new ExtractTextPlugin(cssOutputPath);
//var port = isProduction ? process.env.PORT || 8080 : process.env.PORT || 3000;
var contextroot = process.env.npm_package_config_context_root;

// ------------------------------------------
// Base
// ------------------------------------------
var webpackConfig = {
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    }),
    new HtmlWebpackPlugin({
      title:'indexPC.html',
      filename:'indexPC.html',
      template:Path.join(__dirname, './src/indexPC.html'),
      inject:false,
      chunks:[],
    }),
    new HtmlWebpackPlugin({
      template: Path.join(__dirname, './src/index.html'),
    }),
    new CopyWebpackPlugin([
      { from: Path.join(__dirname, './src/imgs'), to: 'imgs' },
    ]),
  ],
  module: {
    loaders: [],
  },
};

// ------------------------------------------
// Entry points
// ------------------------------------------
/*
webpackConfig.entry = !isProduction
  ? ['webpack-dev-server/client?http://localhost:' + port,
     'webpack/hot/dev-server',
     Path.join(__dirname, './src/client/index')]
  : [Path.join(__dirname, './src/client/index')];
*/
webpackConfig.entry = !isProduction
  ? ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
     Path.join(__dirname, './src/client/index')]
  : [Path.join(__dirname, './src/client/index')];
  
// ------------------------------------------
// Bundle output
// ------------------------------------------

/*
webpackConfig.output = {
  path: Path.join(__dirname, `./${contextroot}`),
  filename: jsOutputPath,
  publicPath: '',
};
*/
webpackConfig.output = !isProduction
  ? {
	  path: Path.join(__dirname, `./${contextroot}`),
	  filename: jsOutputPath,
	  publicPath: `/${contextroot}`,
   }:{
	  path: Path.join(__dirname, `./${contextroot}`),
	  filename: jsOutputPath,
	  publicPath: '',
	};

// ------------------------------------------
// Devtool
// ------------------------------------------
webpackConfig.devtool = isProduction ? 'source-map' : 'cheap-eval-source-map';

// ------------------------------------------
// Module
// ------------------------------------------
isProduction
  ? webpackConfig.module.loaders.push({
      test: /\.css$/,
      loader: ExtractCSS.extract(['css-loader']),
    },
	  {
      test: /.jsx?$/,
      include: Path.join(__dirname, './src/client'),
      loader: 'babel-loader',
    },
    {
      test: /\.(svg|gif|png|eot|woff|ttf)$/,
      loaders: [
        'url-loader'
      ],
    })
  : webpackConfig.module.loaders.push({
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader'],
    },
	  {
      test: /.jsx?$/,
      include: Path.join(__dirname, './src/client'),
      loaders: [ 'react-hot-loader/webpack','babel-loader'],
    },
    {
      test: /\.(svg|gif|png|eot|woff|ttf)$/,
      loaders: [
        'url-loader'
      ],
    }
  );

// ------------------------------------------
// Plugins
// ------------------------------------------
isProduction
  ? webpackConfig.plugins.push(
      new Webpack.optimize.OccurrenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
      ExtractCSS
    )
  : webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin(),
	  new Webpack.NoEmitOnErrorsPlugin()
    );

// ------------------------------------------
// Development server
// ------------------------------------------
/*
if (!isProduction) {
  webpackConfig.devServer = {
    contentBase: Path.join(__dirname, './'),
    hot: true,
    port: port,
    inline: true,
    progress: true,
    historyApiFallback: true,
  };
}
*/

module.exports = webpackConfig;