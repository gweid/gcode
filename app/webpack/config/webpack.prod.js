const path = require('path');
const os = require('os');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const baseConfig = require('./webpack.base.js');

const prodConfig = {
  mode: 'production',
  output: {
    filename: 'js/[name]_[contenthash:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/prod'),
    // 打包出来的 html 文件引用资源的公共路径前缀
    // <script src="/dist/prod/js/entry.page1_xxxxxxxx.bundle.js"></script>
    publicPath: '/dist/prod',
    crossOriginLoading: 'anonymous', // 不带凭据(credential) 允许跨域加
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MinCssExtractPlugin.loader,
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length, // 根据 CPU 核心数设置线程数
              workerParallelJobs: 50, // 每个线程并行任务数
              poolTimeout: 2000, // 线程空闲时的超时时间
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), './app/src')],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length,
              workerParallelJobs: 50,
              poolTimeout: 2000, // 线程空闲时的超时时间
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['public/dist'], {
      root: path.resolve(process.cwd(), './app'),
      verbose: true,
      dry: false,
    }),
    // 提取 CSS 到独立文件
    new MinCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css', // 入口 chunk（entry）抽出来的 CSS 输出文件名模板
      chunkFilename: 'css/[name]_[contenthash:8].css', // 非入口 chunk（通常是动态 import 产生的异步 chunk）抽出来的 CSS 文件名模板
    }),
    // 压缩 CSS
    new CssMinimizerPlugin(),
  ],
  optimization: {
    // 使用 TerserPlugin 的并发和缓存，提升压缩阶段的性能
    // 清除 console.log
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 利用多核 CPU的优势来加快压缩速度
        terserOptions: {
          compress: {
            drop_console: true, // 清除 console.log
          },
          ecma: 2020,
        },
      }),
    ],
  },
};

module.exports = merge.smart(baseConfig, prodConfig);
