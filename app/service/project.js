module.exports = (app) => {
  const BaseService = require('./base')(app);
  return class ProjectService extends BaseService {
    async getList() {
      return [
        { id: 1, name: 'Project Alpha', desc: 'First project' },
        { id: 2, name: 'Project Beta', desc: 'Second project' },
      ];
    }
  };
};
