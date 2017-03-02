var log4js = require('log4js');
var fs = require('fs-extra');
var path = require('path');
const PATTERN = '-yyyyMMdd';
const LoggerDir = __dirname + './../logs';
const LogLayout = {
  type: 'pattern',
  pattern: '%[%d{ISO8601} (%x{pid}) %p %c -%] %m',
  tokens: {
    pid: function () {
      return process.pid;
    }
  }
};
const Config = {
  replaceConsole: true,
  appenders: [{
    type: 'dateFile',
    filename: path.join(LoggerDir, 'dac.log'),
    pattern: PATTERN,
    alwaysIncludePattern: true,
    layout: LogLayout
  }, {
    type: 'dateFile',
    filename: path.join(LoggerDir, 'checkout.log'),
    pattern: PATTERN,
    alwaysIncludePattern: true,
    layout: LogLayout,
    category: 'checkout'
  }, {
    type: 'console',
    layout: LogLayout
  }, {
    type: "logLevelFilter",
    level: "ERROR",
    appender: {
      type: "file",
      filename: path.join(LoggerDir, 'error.log'),
      layout: LogLayout
    }
  }],
  levels: {
    '[all]': 'ALL'
  }
};

function init(app) {
  log4js.configure(Config);
  app.use(log4js.connectLogger(getLogger('router'), {
    level: 'auto',
    format: ':method :url'
  }));
  console.log('Starting Application...');
  console.log('Initializing Logger Config...');
}

function getLogger(name) {
  return log4js.getLogger(name);
}

exports.init = init;
exports.getLogger = getLogger;
