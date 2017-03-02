var logger = require('../utils/logger').getLogger('redis');
var redis = require("redis");
var PV = require('../utils/validation');
const Seconds = require('./../const/seconds');
const {RedisConn, KeyPrefix, Families} = require('./config');
// const ERR_MSG_PREFIX = 'Wrong arguments when call connect method ';//参数错误提示

//########################################## Redis获取key ###############################################
var sessionKey = sessionID => KeyPrefix.SESSION + sessionID;

var loginKey = uniqueId => KeyPrefix.LOGIN + uniqueId;

var regionKey = regionId => KeyPrefix.REGION + regionId;

exports.loginKey = loginKey;

//########################################## Redis的连接 ###############################################
/**
 * 获取Redis连接
 * @param family 数据库
 * @returns {RedisClient}
 */
var getClient = family => {
  var query_db = Number.isInteger(parseInt(family)) ? parseInt(family) : Families.LOGIN;
  // if (!client || (client.connectionOption.family !== query_db)) {
  var client = redis.createClient(RedisConn.port, RedisConn.host, {auth_pass: RedisConn.pass});
  client.select(query_db);
  client.on("error", function (err) {
    logger.error("# User Defined Redis Error : ", err);
  });
  // }
  logger.info('connect db', query_db, 'launched, connected:', client.connected, 'closing:', client.closing);
  return client;
};

var closeClient = (client, resolve, reject, err, data) => {
  if (client) {
    client.quit();
    logger.info('connect db', client.selected_db, 'closed, connected:', client.connected, 'closing:', client.closing);
  }
  if (err) reject && reject(err);
  resolve && resolve(data);
};

var hsetWithMulti = (multi, key, object) => {
  for (var prop in object) {
    multi.hset(key, prop, object[prop] || '');
  }
  return multi;
};

var parse = (err, data) => (!err && JSON.parse(data)) || data;

exports.getClient = getClient;

exports.keys = function*(family, keys) {
  var client = getClient(family);
  return yield new Promise((resolve, reject) => {
    client.keys(keys, (err, data) => closeClient(client, resolve, reject, err, data));
  });
};
/**
 * 执行multi,需要自己end client
 * @param multi
 * @returns {*}
 */
exports.exec = function*(multi) {
  return yield new Promise((resolve, reject) => {
    multi.exec((err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};
//########################################## 自定义的方法 ###############################################
//########################################## 用户信息的登录登出保存 ###############################################
/**
 * 储存用户微信登录信息
 * @param {string} uniqueId 微信unionId或移动设备的deviceId
 * @param {object} userObj 用户对象
 */
exports.cacheUserLoginInfo = function*(uniqueId, userObj) {
  var pv_err = PV().str('uniqueId', uniqueId).obj('userObj', userObj).validate();
  if (pv_err) throw pv_err;
  var _key = loginKey(uniqueId), client = getClient();
  var multi = hsetWithMulti(client.multi(), _key, userObj);
  multi.expire(_key, Seconds.LOGIN_EXPIRE_SECONDS);
  return yield new Promise((resolve, reject) => {
    multi.exec((err, data) => closeClient(client, resolve, reject, err, data));
  });
};
/**
 * 重置用户的属性
 * @param {string} uniqueId 微信unionId或移动设备的deviceId
 * @param {string | object} field_or_obj 用户属性或用户对象
 * @param {*} value 用户属性值
 * @example refreshUserInfo('xxx','name','Charles') // uniqueId - field - value
 * @example refreshUserInfo('xxx',{'name':'Charles','age':25}) // uniqueId - object
 */
exports.refreshUserInfo = function*(uniqueId, field_or_obj, value) {
  var pv_err = PV().str('uniqueId', uniqueId).validate();
  if (pv_err) throw pv_err;
  var _key = loginKey(uniqueId), client = getClient();
  if (typeof field_or_obj == 'object' && !value) {
    let userObj = field_or_obj;
    var multi = hsetWithMulti(client.multi(), _key, userObj);
    return yield new Promise((resolve, reject) => {
      multi.exec((err, data) => closeClient(client, resolve, reject, err, data));
    });
  } else {
    let field = field_or_obj;
    return yield new Promise((resolve, reject) => {
      client.hset(_key, field, value, (err, data) => closeClient(client, resolve, reject, err, data));
    });
  }
};
/**
 * 根据uniqueId获取缓存中用户信息
 * @param {string} uniqueId 微信unionId或移动设备的deviceId
 */
exports.getUserInfoByUniqueId = function*(uniqueId) {
  var pv_err = PV().str('uniqueId', uniqueId).validate();
  if (pv_err) throw pv_err;
  var client = getClient();
  return yield new Promise((resolve, reject) => {
    client.hgetall(loginKey(uniqueId), (err, data) => closeClient(client, resolve, reject, err, data));
  });
};
/**
 * 根据loginKey获取缓存中用户信息
 * @param {string} uniqueId 微信unionId或移动设备的deviceId
 */
exports.getUserInfoByLoginKey = function*(loginKey) {
  var pv_err = PV().str('loginKey', loginKey).validate();
  if (pv_err) throw pv_err;
  var client = getClient();
  return yield new Promise((resolve, reject) => {
    client.hgetall(loginKey, (err, data) => closeClient(client, resolve, reject, err, data));
  });
};
/**
 * 用户注销清除用户缓存信息
 * @param {string} sessionID
 * @param {string} uniqueId 微信unionId或移动设备的deviceId
 */
exports.clearWhenUserLogout = function*(sessionID, uniqueId) {
  var pv_err = PV().str('sessionID', sessionID).str('uniqueId', uniqueId).validate();
  if (pv_err) throw pv_err;
  logger.info('ClearWhenUserLogout sessionID:', sessionID, 'uniqueId:', uniqueId);
  var _loginKey = loginKey(uniqueId), _sessionKey = sessionKey(sessionID);
  var _loginClient = getClient(), _sessionClient = getClient(Families.SESSION);
  return yield [
    new Promise((resolve, reject) => {
      _loginClient.del(_loginKey, (err, data) => closeClient(_loginClient, resolve, reject, err, data));
    }), new Promise((resolve, reject) => {
      _sessionClient.del(_sessionKey, (err, data) => closeClient(_sessionClient, resolve, reject, err, data));
    })];
};
//########################################## Region ###############################################
/**
 * 缓存区域信息(七天失效,重新设置)
 * @param {Array} regionArr
 */
exports.saveRegionDistricts = function*(regionArr) {
  var map = new Map();
  for (var region of regionArr) {
    var arr = map.get(region.pid);
    arr = arr || [];
    arr.push(region);
    map.set(region.pid, arr);
  }
  var client = getClient(Families.CONSTANTS);
  var multi = client.multi();
  for (let key of map.keys()) {
    let _key = regionKey(key);
    multi.set(_key, JSON.stringify(map.get(key)));
    multi.expire(_key, Seconds.WEEK_SECONDS);
  }
  return yield new Promise((resolve, reject) => {
    multi.exec((err, data) => closeClient(client, resolve, reject, err, data));
  });
};
/**
 * 根据parentID查询区域信息
 * @param pid
 * @returns {*}
 */
exports.getRegionListByPid = function*(pid) {
  var pv_err = PV().num('regionParentId', pid).validate();
  if (pv_err) throw pv_err;
  var client = getClient(Families.CONSTANTS);
  return yield new Promise((resolve, reject) => {
    client.get(regionKey(pid), (err, data) => closeClient(client, resolve, reject, err, parse(err, data)));
  });
};