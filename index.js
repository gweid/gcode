const path = require('path');
const ElpisCore = require('./elpis-core');

const { sep } = path;

const middlewareLoaderDir = path.resolve(process.cwd(), `.${sep}app${sep}middleware-loader`);

ElpisCore.start({
  name: 'Elpis',
  homePage: '/',
  middlewareLoaderDir, // 自定义 loader 路径
});
