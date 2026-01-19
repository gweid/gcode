module.exports = (app) => {
  return {
    isLocal() {
      return process.env._ENV === 'local';
    },
    isTest() {
      return process.env._ENV === 'test';
    },
    isProd() {
      return process.env._ENV === 'prod';
    },
    getEnv() {
      return process.env._ENV || 'local';
    },
  };
};
