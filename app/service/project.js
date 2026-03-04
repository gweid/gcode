module.exports = (app) => {
  const BaseService = require('./base')(app);
  const modelList = require('../../model')(app);

  return class ProjectService extends BaseService {
    /**
     * 获取所有模型数据
     * @returns
     */
    async getModelList() {
      return modelList;
    }

    /**
     * 获取当前 projectKey 下对应的项目列表（如果无 projectKey，则返回所有项目）
     * @param {*} projKey
     * @returns
     */
    async getList(projKey) {
      return modelList.reduce((preList, item) => {
        const { project } = item;

        if (projKey && !project[projKey]) return preList;

        for (const pKey in project) {
          preList.push(project[pKey]);
        }

        return preList;
      }, []);
    }
  };
};
