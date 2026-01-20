const koaBodyParser = require('koa-bodyparser');

module.exports = (app) => {
  app.use(
    koaBodyParser({
      formLimit: '1000mb',
      enableTypes: ['json', 'form', 'text'],
    }),
  );
};
