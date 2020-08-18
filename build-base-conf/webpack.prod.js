const { srcPath, distPath } = require('./path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');


module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contentHash:8].js',
    path: distPath,
    // publicPath: 'cnd.'  这里可以配置cdn的服务
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],
        include: srcPath,
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 5 * 1024,
            // outputPath: '//' 配置打包图片的路径
          }
        }
      },
      {
        test: /\.css$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        loader: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugin: [
    // 抽离css文件
    new MiniCssExtractPlugin({
      filename: 'css/main.[contentHash:8].css'
    }),
    // happypack 开启多线程打包
    new HappyPack({
      // 用唯一标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory']
    }),

    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          beautify: false, // 最紧促的输出
          cmmments: false // 删除所有注释
        },
        compress: {
          // 删除所有的 console 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只是用到一此的变量
          collapse_vars: ture,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true
        }
      }
    })
  ],
  optimization: {
    // 压缩css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],

    // 分割代码块
    splitChunks: {
      chunks: 'all',

      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vender: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高,优先抽离
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1 //最少复用过几次
        },

        // 公共模块
        common: {
          name: 'common',
          priority: 0,
          minSize: 0,
          minChunks: 2
        }
      }
    }
  }
})