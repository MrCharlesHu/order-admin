var path = require('path');
var fs = require('fs-extra');
/**
 * MySQL连接配置
 * @type {{host: string, user: string, password: string, database: string}}
 */
const MySQLConn = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ordsys'
};
/**
 * Redis连接配置
 * @type {{host: string, port: number, pass: string}}
 */
const RedisConn = {
  host: 'localhost',
  port: 6379,
  pass: 'pwd_redis_ud'
};
/**
 * Redis key前缀
 * @type {{SESSION: string, LOGIN: string, REGION: string}}
 */
const KeyPrefix = {
  SESSION: 'sess:',
  LOGIN: 'sGn',//gst_login,cookie设置时需要做前缀,请大小写混合设置
  REGION: 'region:'
};
/**
 * Redis连接的数据库
 * @type {{SESSION: number, LOGIN: number, REGION: number}}
 */
const Families = {
  SESSION: 0,
  LOGIN: 1,
  REGION: 2
};
/**
 * 用来识别取值的cookie
 * @type {{SESSION_ID: string, LOGIN_INFO: string}}
 */
const CookiesKey = {
  SESSION_ID: '_oi_',
  LOGIN_INFO: '_n_i'
};
/**
 * Cookie设置的选项
 * @type {{path: string, httpOnly: boolean, secure: boolean}}
 */
const CookiesConf = {
  path: '/',
  // expires: 0,
  httpOnly: true,
  secure: false
  // maxAge: null
};
/**
 * 日志目录
 */
const LoggerDir = path.resolve(__dirname, './../logs');
const TempDir = path.resolve(__dirname, './../temp');

exports.MySQLConn = MySQLConn;
exports.RedisConn = RedisConn;
exports.KeyPrefix = KeyPrefix;
exports.Families = Families;
exports.CookiesKey = CookiesKey;
exports.CookiesConf = CookiesConf;
exports.LoggerDir = LoggerDir;

(() => {
  fs.ensureDirSync(LoggerDir);
  fs.ensureDirSync(TempDir);
})();