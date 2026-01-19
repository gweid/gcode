const path = require('path');
const glob = require('glob');

const { sep } = path;

/**
 * extend loader
 * @param {*} app koa 实例
 *
 * 加载所有 extend，使得可通过 'app.extend.${文件}' 访问
 */
module.exports = (app) => {
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);

  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}*.js`));

  fileList.forEach((file) => {
    // 获取文件名：app/extend/test.js --> test
    //           app/extend/test-extend.js --> testExtend
    let name = file.replace(extendPath + sep, '').replace('.js', '');

    // 转换为驼峰式命名：test-extend --> testExtend
    name = name.replace(/[-_](\w)/g, (_, c) => (c ? c.toUpperCase() : ''));

    // 过滤 app 已经存在的 key
    if (name in app) {
      console.log(`[extend load error] name: ${name} is already in app`);
      return;
    }

    app[name] = require(path.resolve(file))(app);
  });
};
