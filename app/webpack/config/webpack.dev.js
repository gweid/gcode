const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackBaseConfig = require('./webpack.base.js');

const PROJECT_ROOT = path.resolve(process.cwd());
const NODE_MODULES_PATH = path.resolve(PROJECT_ROOT, 'node_modules');

const escapeForRegex = (input) => {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const toPathPattern = (absolutePath) => {
  return escapeForRegex(absolutePath.replace(/\\/g, '/')).replace(/\//g, '[\\\\/]');
};

const projectRootPattern = toPathPattern(PROJECT_ROOT);
const nodeModulesPattern = toPathPattern(NODE_MODULES_PATH);
const WATCH_POLL_INTERVAL = Number(process.env.WATCH_POLL_INTERVAL || 1000);
const WATCH_IGNORED = new RegExp(
  // 忽略项目外路径 + 项目内 node_modules，避免 Watchpack 扫描 HOME 或超量监听
  `^(?:${nodeModulesPattern}(?:[\\\\/]|$)|(?!${projectRootPattern}(?:[\\\\/]|$)).+)`,
);

const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '__webpack_hmr', // 官方规定
  TIMEOUT: 20000,
};

Object.keys(webpackBaseConfig.entry).forEach((key) => {
  if (key !== 'vendor') {
    webpackBaseConfig.entry[key] = [
      webpackBaseConfig.entry[key],
      `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`, // webpack-dev-server 热更新连接地址
    ];
  }
});

const webpackDevConfig = merge.smart(webpackBaseConfig, {
  mode: 'development',
  output: {
    filename: 'js/[name]_[contenthash:8].bundle.js',
    path: path.resolve(process.cwd(), './app/public/dist/dev'),
    // 打包出来的 html 文件引用资源的公共路径前缀
    // <script src="/dist/dev/js/entry.page1_xxxxxxxx.bundle.js"></script>
    publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev`,
    crossOriginLoading: 'anonymous', // 不带凭据(credential) 允许跨域加载
    globalObject: 'this', // 解决 web worker 环境下无法使用 window 对象的问题
  },
  watchOptions: {
    // 只保留项目内监听，屏蔽项目外目录（含 HOME 下异常挂载路径）
    ignored: WATCH_IGNORED,
    // macOS 下开启轮询可避免 watchpack 递归创建父目录 watcher
    poll: WATCH_POLL_INTERVAL,
    aggregateTimeout: 300,
  },
  devtool: 'source-map',
  plugins: [
    // 热更新插件
    new webpack.HotModuleReplacementPlugin({
      multiple: false,
    }),
  ],
});

module.exports = {
  webpackDevConfig,
  DEV_SERVER_CONFIG,
};
