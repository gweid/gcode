module.exports = (app) => {
  const BaseController = require('./base')(app);

  return class ProjectController extends BaseController {
    async getList(ctx) {
      const { project: projectService } = this.services;
      const res = await projectService.getList();

      this.success(ctx, res);
    }

    async updateProject(ctx) {
      this.success(ctx);
    }

    async getModelList(ctx) {
      const { project: projectService } = this.services;

      const res = await projectService.getModelList();

      const dtoModelList = res.reduce((preList, item) => {
        const { model, project } = item;

        const { key, name, desc } = model;
        const dtoModel = { key, name, desc };

        const dtoProject = {};
        for (const projKey in project) {
          const { key, name, desc, homePage } = project[projKey];
          dtoProject[projKey] = { key, name, desc, homePage };
        }

        preList.push({
          model: dtoModel,
          project: dtoProject,
        });

        return preList;
      }, []);

      this.success(ctx, dtoModelList);
    }
  };
};
