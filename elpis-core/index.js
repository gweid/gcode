const koa = require('koa');
const path = require('path');
const glob = require('glob');
const env = require('./env');
const middlewareLoader = require('./loaders/middleware');
const routerLoader = require('./loaders/router');
const routerSchemaLoader = require('./loaders/router-schema');
const controllerLoader = require('./loaders/controller');
const serviceLoader = require('./loaders/service');
const extendLoader = require('./loaders/extend');
const configLoader = require('./loaders/config');

const { sep } = path;

function start(options = {}) {
  const app = new koa();

  app.options = options;

  // 基础路径：项目根目录
  app.basePath = process.cwd();

  // 业务路径：app，sep 主要是兼容不同平台的 /
  app.businessPath = path.resolve(app.basePath, `.${sep}app`);

  app.env = env();
  console.log(`-- [start] env: ${app.env.getEnv()} --`);

  // 加载 middleware
  middlewareLoader(app);
  console.log(`-- [start] load middleware done --`);

  // 加载 router schema
  routerSchemaLoader(app);
  console.log(`-- [start] load routerSchema done --`);

  // 加载 controller
  controllerLoader(app);
  console.log(`-- [start] load controller done --`);

  // 加载 service
  serviceLoader(app);
  console.log(`-- [start] load service done --`);

  // 加载 config
  configLoader(app);
  console.log(`-- [start] load config done --`);

  // 加载 extend
  extendLoader(app);
  console.log(`-- [start] load extend done --`);

  // 注册全局中间件（即允许自定义 elpis 中间件 loader）
  const middlewareLoaderDir = options.middlewareLoaderDir;
  const middlewareLoaderList = glob.sync(path.resolve(middlewareLoaderDir), `.${sep}**${sep}*.js`);
  if (middlewareLoaderList.length > 0) {
    middlewareLoaderList.forEach((file) => {
      try {
        require(path.resolve(file))(app);
      } catch (error) {
        console.log('[exception] there is no global middleware file');
      }
    });
    console.log(`-- [start] load custom middleware loader done --`);
  }

  // 注册路由
  routerLoader(app);
  console.log(`-- [start] load router done --`);

  try {
    const port = process.env.PORT || 3078;
    const host = process.env.HOST || '0.0.0.0';

    app.listen(port, host);

    console.log(`Server running on http://127.0.0.1:${port}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  start,
};
