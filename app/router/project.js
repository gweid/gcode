module.exports = (app, router) => {
  const { project: projectController } = app.controllers;

  router.get('/api/project/list', projectController.getList.bind(projectController));

  router.post('/api/project/update', projectController.updateProject.bind(projectController));
};
