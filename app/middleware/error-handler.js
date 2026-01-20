/**
 * 运行时错误处理中间件
 * @param {*} app koa 实例
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      // 这里为什么是这样？
      // 因为，在后续所有的操作，都会放在 next() 之后执行
      // 那么就会捕捉到所有后续操作的异常
      await next();
    } catch (error) {
      const { status, message, detail } = error;
      app.logger.info(JSON.stringify(error));
      app.logger.error('[-- exception --]:', error);
      app.logger.error('[-- exception --]:', status, message, detail);

      if (message && message.includes('template not found')) {
        // 访问到不存在的页面，进行重定向
        ctx.status = 302;
        ctx.redirect(app.options?.homePage || '/');
        return;
      }

      const resBody = {
        success: false,
        code: 50000,
        message: '请求错误，请稍后重试',
      };

      ctx.status = 200;
      ctx.body = resBody;
    }
  };
};
