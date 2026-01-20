module.exports = (app) => {
  return class BaseController {
    constructor() {
      this.app = app;
    }

    get config() {
      return this.app.config;
    }

    get services() {
      return this.app.services;
    }

    /**
     * API 处理成功时，统一返回格式
     * @param {*} ctx 上下文
     * @param {*} data 成功数据
     * @param {*} metadata 附加数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }

    /**
     * API 处理成功时，统一返回格式
     * @param {*} ctx 上下文
     * @param {*} message 错误信息
     * @param {*} code 错误码
     */
    fail(ctx, message, code) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code,
        message,
      };
    }
  };
};
