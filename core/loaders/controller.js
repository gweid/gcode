const path = require('path');
const glob = require('glob');

const { sep } = path;

/**
 * controller loader
 * @param {*} app koa 实例
 *
 * 加载所有 controller，使得可通过 'app.controller.${目录}.${文件}' 访问
 */
module.exports = (app) => {
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);

  const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}*.js`));

  const controllers = {};

  fileList.forEach((file) => {
    // 获取文件名：app/controller/test.js --> test
    //           app/controller/custom/test.js --> custom/test
    let name = file.replace(controllerPath + sep, '').replace('.js', '');

    // 转换为驼峰式命名：custom/test-controller --> custom/testController
    name = name.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));

    let tempController = controllers;

    const nameList = name.split(sep);

    // 实现：{ test: [Function], custom: { customController: [Function] } }
    // 使得可以：custom.customController 这样进行使用
    nameList.forEach((item, index) => {
      if (index === nameList.length - 1) {
        const ControllerModule = require(path.resolve(file))(app);
        tempController[item] = new ControllerModule();
      } else {
        if (!tempController[item]) {
          tempController[item] = {};
        }

        tempController = tempController[item];
      }
    });
  });

  app.controllers = controllers;
};
