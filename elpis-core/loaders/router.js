const path = require('path');
const glob = require('glob');
const KoaRouter = require('koa-router');

const { sep } = path;

/**
 * router loader
 * @param {*} app koa 实例
 *
 * 解释所有 app/router/ 下所有 js 文件，加载到 KoaRouter
 */
module.exports = (app) => {
  const routerPath = path.resolve(app.businessPath, `.${sep}router`);

  // 实例化 KoaRouter
  const router = new KoaRouter();

  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}*.js`));

  fileList.forEach((file) => {
    require(path.resolve(file))(app, router);
  });

  // 做兜底，如果上面没有匹配上任何路由，则重定向到首页
  router.get('*', async (ctx) => {
    ctx.status = 302;
    ctx.redirect(`${app?.options?.homePage || '/'}`);
  });

  app.use(router.routes()).use(router.allowedMethods());
};
