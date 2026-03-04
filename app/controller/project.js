module.exports = (app) => {
  const BaseController = require('./base')(app);

  return class ProjectController extends BaseController {
    /**
     * 获取所有模型项目列表
     * @param {*} ctx 上下文
     */
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

    /**
     * 获取当前 projectKey 下对应的项目列表（如果无 projectKey，则返回所有项目）
     * @param {*} ctx
     */
    async getList(ctx) {
      const { project: projectService } = this.services;

      const { proj_key: projKey } = ctx.request.query;
      const projList = await projectService.getList(projKey);

      const dtoProjList = projList.map((item) => {
        const { key, name, desc, homePage } = item;
        return { modelKey, key, name, desc, homePage };
      });

      this.success(ctx, dtoProjList);
    }
  };
};
