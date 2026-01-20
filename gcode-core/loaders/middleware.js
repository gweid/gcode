const path = require('path');
const glob = require('glob');

const { sep } = path;

/**
 * middleware loader
 * @param {*} app koa 实例
 *
 * 加载所有 middleware，使得可通过 'app.middleware.${目录}.${文件}' 访问
 */
module.exports = (app) => {
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);

  const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}*.js`));

  const middlewares = {};

  fileList.forEach((file) => {
    // 获取文件名：app/middleware/test.js --> test
    //           app/middleware/custom/test.js --> custom/test
    let name = file.replace(middlewarePath + sep, '').replace('.js', '');

    // 转换为驼峰式命名：custom/test-middleware --> custom/testMiddleware
    name = name.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));

    let tempMiddleware = middlewares;

    const nameList = name.split(sep);

    // 实现：{ test: [Function], custom: { customMiddleware: [Function] } }
    // 使得可以：custom.customMiddleware 这样进行使用
    nameList.forEach((item, index) => {
      if (index === nameList.length - 1) {
        tempMiddleware[item] = require(path.resolve(file))(app);
      } else {
        if (!tempMiddleware[item]) {
          tempMiddleware[item] = {};
        }

        tempMiddleware = tempMiddleware[item];
      }
    });
  });

  app.middlewares = middlewares;
};
