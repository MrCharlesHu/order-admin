var _ = require('lodash');
var logger = require('./utils/logger').getLogger('contexts');
var redisLoginKey = require('./connect/redis').loginKey;
var {CookiesKey, CookiesConf} = require('./config');
var Page = require('./utils/pageable').Page;
const isError = require('./utils/objects').isError;
const ErrorCode = require('./const/error_code');
const MsgTip = require('./const/msg_tip');
const SQL_KEYS = ['select', 'create', 'update', 'delete'];
const SUCCESS_MSG = 'success';
const FAILED_MSG = 'failed';
const EMPTY_OBJECT = {};
const EMPTY_STR = '';

/**
 * Created by Charles on 16/5/17.
 * Router中返回数据使用
 * @param {ServerResponse} response
 * @constructor
 */
function Context(response) {
  this.response = response;
}
/**
 * 返回数据
 * @param {number} err 错误信息数字标识
 * @param {*} data 返回数据
 * @param {string} msg 错误信息
 * @private
 */
Context.prototype.doReturn = function (err, data, msg) {
  if (this.response.headersSent) {
    logger.error('Response headers已返回,请检查此处错误');
  } else {
    this.response.json({err: err, data: data, msg: msg});
  }
};
/**
 * 操作成功,返回数据
 * @param data
 */
Context.prototype.success = function (data, msg) {
  this.doReturn(ErrorCode.SUCCESS, data || EMPTY_OBJECT, msg || SUCCESS_MSG);
};
/**
 * 操作成功,返回分页数据
 * @param {OrderDetail} page
 */
Context.prototype.pageable = function (page, msg) {
  this.doReturn(ErrorCode.SUCCESS, page || new Page(), msg || SUCCESS_MSG);
};
/**
 * 操作失败,返回错误信息
 * @param {*} msg
 */
Context.prototype.error = function (err) {
  var msg = isError(err) && err.message || err;
  if (isError(err)) {
    if (SQL_KEYS.some(key => msg.indexOf(key) != -1)) {
      msg = MsgTip.DB_CONN_ERR;
    }
    logger.debug(err.stack);
  }
  logger.error(msg);
  this.doReturn(ErrorCode.ERROR, EMPTY_OBJECT, msg || FAILED_MSG);
};
/**
 * 请求参数有错,返回提示提醒
 * @param {object} field
 */
Context.prototype.wrongParams = function (field) {
  this.doReturn(ErrorCode.WRONG_PARAMS, EMPTY_OBJECT, '参数[' + field + ']错误!');
};
/**
 * 请求未被授权,返回提示信息
 */
Context.prototype.noWechatAuth = function () {
  this.doReturn(ErrorCode.NO_WECHAT_AUTH, EMPTY_OBJECT, '您没有通过微信授权!');
};
/**
 * 用户未登录,返回提示信息
 */
Context.prototype.notLogin = function (msg) {
  this.doReturn(ErrorCode.NOT_LOGIN, EMPTY_OBJECT, msg || MsgTip.USER_NOT_LOGIN);
};
/**
 * 用户未注册,返回提示信息
 */
Context.prototype.notRegistered = function () {
  this.doReturn(ErrorCode.NOT_REGISTERED, EMPTY_OBJECT, MsgTip.USER_NOT_REGISTERED);
};
/**
 * 返回实例化的对象
 * @param {ServerResponse} response
 * @returns {Context}
 */
exports.Ctx = function (response) {
  return new Context(response);
};
/**
 * Router中返回数据使用
 * @param {ServerResponse} response
 * @param {Promise} promise
 * @constructor
 */
function CoContext(response, promise) {
  this.response = response;
  this.promise = promise;
}
CoContext.prototype = new Context(null);

CoContext.prototype.coSuccess = function (msg) {
  this.promise.then(data => this.success(data, msg)).catch(err => this.error(err));
};

CoContext.prototype.coPageable = function (msg) {
  this.promise.then(page => this.pageable(page, msg)).catch(err => this.error(err));
};

CoContext.prototype.loginSuccess = function () {
  this.promise.then(([uniqueId, userInfo]) => {
    var userObj = userInfo && _.mapValues(userInfo, val => Number.isInteger(val) ? val : val || EMPTY_STR);
    this.response.cookie(CookiesKey.LOGIN_INFO, redisLoginKey(uniqueId), CookiesConf);
    this.doReturn(ErrorCode.SUCCESS, userObj || EMPTY_OBJECT, MsgTip.LOGIN_SUCCESS);
  }, err => {
    this.error(err);
  }).catch(err => {
    logger.error('LoginSuccess方法未返回的Catch的错误', err);
    this.error(MsgTip.LOGIN_INFO_WRONG);
  });
};
/**
 * 返回实例化的对象
 * @param {ServerResponse} response
 * @returns {CoContext}
 */
exports.CoCtx = function (response, promise) {
  return new CoContext(response, promise);
};