const path = require('path');
const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const consoler = require('consoler');
const { webpackDevConfig, DEV_SERVER_CONFIG } = require('./config/webpack.dev');

const { PORT } = DEV_SERVER_CONFIG;

const app = express();

const compiler = webpack(webpackDevConfig);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, './public/dist')));

// devMiddleware 中间件，监控文件改动
app.use(
  devMiddleware(compiler, {
    // 需要写入磁盘的文件：html；其他文件保存在内存里，这样热更新更快
    // 为什么 html 要写入磁盘？因为本质是 koa 去读里面的配置文件，并返回 html 给浏览器，所以需要写入磁盘
    writeToDisk: (filePath) => filePath.endsWith('.html'),
    // 资源路径
    publicPath: webpackDevConfig.output.publicPath,
    // 跨域处理：headers 配置，不加这个，由于是JSONP，也能正常访问，但是为了程序的健壮性，配置允许跨域更好
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
    },
    // 日志配置
    stats: {
      colors: true,
    },
  }),
);

// hotMiddleware 中间件，实现热更新通讯
app.use(
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {},
  }),
);

consoler.info('请等待webpack初次构建完成提示...');

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
