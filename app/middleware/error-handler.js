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
    } catch (error) {}
  };
};
