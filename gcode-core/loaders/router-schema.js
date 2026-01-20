const path = require('path');
const glob = require('glob');

const { sep } = path;

/**
 * router-schema loader
 * @param {*} app koa 实例
 *
 * 通过 'jaon-schema' 和 'ajv' 对 API 进行约束
 * app.routerSchema = {
 *   '$api1': $jsonSchema1,
 *   '$api2': $jsonSchema2
 * }
 */
module.exports = (app) => {
  const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);

  const fileList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}*.js`));

  let routerSchema = {};

  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(file),
    };
  });

  app.routerSchema = routerSchema;
};
