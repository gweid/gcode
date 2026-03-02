module.exports = (app) => {
  const BaseService = require('./base')(app);
  const modelList = require('../../model')(app);

  return class ProjectService extends BaseService {
    async getModelList() {
      return modelList;
    }
  };
};
