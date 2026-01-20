const md5 = require('md5');

module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 /api 路径进行签名验证
    if (!ctx.path.startsWith('/api')) {
      return await next();
    }

    const {
      path,
      method,
      request: { headers },
    } = ctx;
    const { s_sign: sSign, s_t: st } = headers;

    const signKey = app.config.signKey;

    const signature = md5(`${signKey}_${st}`);

    app.logger.info(`[${method} ${path}] signature: ${signature}`);

    // 没有签名、没有时间、签名不对、时效>600s，则认为签名不合法
    if (!sSign || !st || signature !== sSign.toLowerCase() || Date.now() - st > 600 * 1000) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 40100,
        message: 'signature not correct or api timeout!',
      };
      return;
    }

    await next();
  };
};
