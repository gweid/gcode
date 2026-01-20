module.exports = (app) => {
  return class ProjectService {
    async getList() {
      // Simulate fetching list of projects
      return [
        { id: 1, name: 'Project Alpha', desc: 'First project' },
        { id: 2, name: 'Project Beta', desc: 'Second project' },
      ];
    }
  };
};
