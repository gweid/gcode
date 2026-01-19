const path = require('path');
const koaStatic = require('koa-static');

const { sep } = path;

/**
 * 配置 koa 静态目录
 * @param {*} app
 */
module.exports = (app) => {
  // 设置 app/public 目录为静态资源目录
  app.use(koaStatic(path.resolve(process.cwd(), `.${sep}app${sep}public`)));
};
