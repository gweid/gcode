const path = require('path');
const GCodeCore = require('./gcode-core');

const { sep } = path;

const middlewareLoaderDir = path.resolve(process.cwd(), `.${sep}app${sep}middleware-loader`);

GCodeCore.start({
  name: 'GCode',
  homePage: '/view/index',
  middlewareLoaderDir, // 自定义 loader 路径
});
