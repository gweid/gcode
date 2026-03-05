const Ajv = require('ajv');

const ajv = new Ajv();

module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 api 进行参数验证
    if (!ctx.path.startsWith('/api')) {
      return await next();
    }

    const { path, method, params } = ctx;
    const { body, query, headers } = ctx.request;

    app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`);
    app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`);
    app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`);
    app.logger.info(`[${method} ${path}] headers: ${JSON.stringify(headers)}`);

    const schema = app.routerSchema?.[path]?.[method.toLowerCase()];

    if (!schema) {
      return await next();
    }

    let valid = true;

    // ajv 校验器
    let validate;

    // 校验 headers
    if (valid && headers && schema.headers) {
      validate = ajv.compile(schema.headers);
      valid = validate(headers);
    }

    // 校验 body
    if (valid && body && schema.body) {
      validate = ajv.compile(schema.body);
      valid = validate(body);
    }

    // 校验 query：/api/project/list?limit=10
    if (valid && query && schema.query) {
      validate = ajv.compile(schema.query);
      valid = validate(query);
    }

    // 校验 params：/api/project/update/:id
    if (valid && params && schema.params) {
      validate = ajv.compile(schema.params);
      valid = validate(params);
    }

    if (!valid) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 40200,
        message: `request validate fail: ${ajv.errorsText(validate.errors)}`,
      };
      return;
    }

    await next();
  };
};
