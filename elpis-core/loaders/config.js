const path = require('path');

const { sep } = path;

/**
 * config loader
 * @param {*} app koa 实例
 *
 * 区分环境：本地、测试、生产，通过 env 环境读取到不同文件配置 env.config
 * 通过 env.config 覆盖 default.config 加载到 app.config 中
 *
 * 默认配置：config/config.default.js
 * 本地配置：config/config.local.js
 * 测试配置：config/config.test.js
 * 生产配置：config/config.prod.js
 */
module.exports = (app) => {
  // config 目录
  const configPath = path.resolve(app.basePath, `.${sep}config`);

  // 获取 default config
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`));
  } catch (error) {
    console.log('[exception] there is no default.config file');
  }

  // 通过 env 获取当前环境
  let envConfig = {};
  try {
    envConfig = require(path.resolve(configPath, `.${sep}config.${app.env.getEnv()}.js`));
  } catch (error) {
    console.log('[exception] there is no env.config file');
  }

  // 加载并覆盖 config 配置
  app.config = Object.assign({}, defaultConfig, envConfig);
};
