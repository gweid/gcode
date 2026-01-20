const path = require('path');
const koaNunjucks = require('koa-nunjucks-2');

const { sep } = path;

module.exports = (app) => {
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
};
