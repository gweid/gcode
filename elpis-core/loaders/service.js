const path = require('path');
const glob = require('glob');

const { sep } = path;

/**
 * service loader
 * @param {*} app koa 实例
 *
 * 加载所有 service，使得可通过 'app.service.${目录}.${文件}' 访问
 */
module.exports = (app) => {
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);

  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}*.js`));

  const services = {};

  fileList.forEach((file) => {
    // 获取文件名：app/service/test.js --> test
    //           app/service/custom/test.js --> custom/test
    let name = file.replace(servicePath + sep, '').replace('.js', '');

    // 转换为驼峰式命名：custom/test-service --> custom/testService
    name = name.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));

    let tempService = services;

    const nameList = name.split(sep);

    // 实现：{ test: [Function], custom: { customService: [Function] } }
    // 使得可以：custom.customService 这样进行使用
    nameList.forEach((item, index) => {
      if (index === nameList.length - 1) {
        const ServiceModule = require(file)(app);
        tempService[item] = new ServiceModule();
      } else {
        if (!tempService[item]) {
          tempService[item] = {};
        }

        tempService = tempService[item];
      }
    });
  });

  app.services = services;
};
