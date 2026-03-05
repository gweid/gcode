module.exports = (app, router) => {
  const { view: viewController } = app.controllers;

  router.get('/view/:page', viewController.render.bind(viewController));
};
