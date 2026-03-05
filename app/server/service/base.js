const superagent = require('superagent');

module.exports = (app) => {
  return class BaseService {
    constructor() {
      this.app = app;
      this.superagent = superagent;
    }

    get config() {
      return this.app.config;
    }
  };
};
