const path = require('path');
const koaNunjucks = require('koa-nunjucks-2');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');

const { sep } = path;

module.exports = (app) => {
  // 渲染 html
  app.use(
    koaNunjucks({
      ext: 'html',
      // 设置模板目录
      path: path.resolve(process.cwd(), `.${sep}app${sep}public`),
      nunjucksConfig: {
        noCache: true, // 开发环境不缓存
        trimBlocks: true, // 自动去除块级标签后的换行
      },
    }),
  );

  // 设置 app/public 目录为静态资源目录
  app.use(koaStatic(path.resolve(process.cwd(), `.${sep}app${sep}public`)));

  // 解析请求体
  app.use(
    koaBodyParser({
      formLimit: '1000mb',
      enableTypes: ['json', 'form', 'text'],
    }),
  );

  // 错误处理中间件
  app.use(app.middlewares.errorHandler);

  // api 签名验证中间件
  app.use(app.middlewares.apiSignVerify);

  // 参数校验中间件
  app.use(app.middlewares.apiParamsVerify);
};
