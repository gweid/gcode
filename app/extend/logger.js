const log4js = require('log4js');

module.exports = (app) => {
  let logger;

  if (app.env.isLocal()) {
    logger = console;
  } else {
    log4js.configure({
      appenders: {
        console: { type: 'console' },
        // 日志文件切分
        dateFile: {
          type: 'dateFile',
          filename: 'logs/application.log',
          pattern: 'yyyy-MM-dd',
          keepFileExt: true, // 保持 .log 扩展名
          numBackups: 30, // 保留最近 30 天的日志文件
        },
      },
      categories: {
        default: {
          appenders: ['console', 'dateFile'],
          level: 'trace',
        },
      },
    });

    logger = log4js.getLogger();
  }

  return logger;
};
