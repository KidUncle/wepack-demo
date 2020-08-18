const { srcPath, distPath } = require('./path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: 'file-loader'
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: distPath,
    port: 8000,
    open: true,
    compress: true, // 启动Gzip压缩
    progress: true, // 显示打包的进度条

    hot: true,

    // 服务端代理配置
    // proxy: {
    //   '/api': ''
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
})