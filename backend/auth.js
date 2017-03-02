var co = require('co');
var _ = require('lodash');
var Ctx = require('../lib/contexts').CoCtx;
var logger = require('../lib/logger').getLogger('backend-info-access');
var RedisUtils = require('../lib/connect/redis_utils');
var PV = require('../lib/param_validation');
var customerService = require('../service/customer');
var userService = require('../service/user');
const MsgTip = require('../lib/const/msg_tip');
//Request中添加用户类型
const userRequest = (req, res, next) => {
  req.query['userType'] = UserType.USER;
  next();
};
//Request中添加用户类型
const customerRequest = (req, res, next) => {
  req.query['userType'] = UserType.CUSTOMER;
  next();
};
//用户类型
const getUserType = req => req.query['userType'];
//用户类型对应的service
const getService = userType => {
  if (userType != UserType.USER && userType != UserType.CUSTOMER) {
    throw new Error(MsgTip.REQUEST_USER_WRONG);
  }
  return userType == UserType.USER ? userService : customerService;
};
//登录用户的uniqueId
const loginUserUniqueId = req => req.session && req.session.userInfo && req.session.userInfo.uniqueId;
//微信中是unionId,IOS和Android中是deviceId,web页面是sessionID
const requestUniqueId = req => req.body.uniqueId || req.query.uniqueId || req.sessionID;
//查看用户信息是否有eid
const isUserInfoValid = userInfo => userInfo && userInfo.eid;
/**
 * 用户登录
 */
function login(req, res) {
  const userType = getUserType(req);
  const uniqueId = requestUniqueId(req);
  const account = req.body.account;
  const password = req.body.password;
  const sourceType = req.body.sourceType;
  var cop = co(function*() {
    var pv_err = PV().in('来源类型', sourceType, [WECHAT, IOS, ANDROID, WEB]).validate();
    if (pv_err) throw pv_err;
    var userInfo = yield* getService(userType).login(account, password);
    if (isUserInfoValid(userInfo)) {
      userInfo['uniqueId'] = uniqueId;
      userInfo['sourceType'] = sourceType;
      yield* RedisUtils.cacheUserLoginInfo(uniqueId, userInfo);
      req.session.userInfo = userInfo;
      return [uniqueId, userInfo];
    } else {
      throw new Error(MsgTip.ACCOUNT_OR_PASSWORD_WRONG);
    }
  });
  Ctx(res, cop).loginSuccess();
}
/**
 * 用户注销
 */
function logout(req, res) {
  const uniqueId = loginUserUniqueId(req);
  logger.info('cookie', req.cookies);
  logger.info(`User logout uniqueId ${uniqueId}`);
  var cop = co(function*() {
    if (uniqueId) {
      var userInfo = yield* RedisUtils.getUserInfoByUniqueId(uniqueId);
      var userType = userInfo.sourceType == WEB ? UserType.USER : UserType.CUSTOMER;
      yield* getService(userType).logout(userInfo.eid, userInfo.account);
      var retObj = yield* RedisUtils.clearWhenUserLogout(req.sessionID, uniqueId);
      logger.info('After logout ', retObj, ' # ', req.session && req.session.userInfo);
      return {};
    } else {
      throw new Error(MsgTip.USER_NOT_LOGIN);
    }
  });
  Ctx(res, cop).coSuccess(MsgTip.LOGOUT_SUCCESS);
}
/**
 * 根据unionId从缓存中获取用户信息
 */
function getCacheInfo(req, res) {
  const uniqueId = loginUserUniqueId(req);
  logger.info(`getCacheInfo >> UniqueId ${uniqueId} SessionID ${req.sessionID}`);
  var cop = co(function*() {
    if (uniqueId) {
      var userInfo = yield* RedisUtils.getUserInfoByUniqueId(uniqueId);
      logger.info('After query from connect, userInfo: ', userInfo);
      if (isUserInfoValid(userInfo)) {
        _.extend(req.session.userInfo, userInfo);
        return userInfo;
      } else {
        throw new Error(MsgTip.USER_NOT_LOGIN);
      }
    } else {
      throw new Error(MsgTip.USER_NOT_LOGIN);
    }
  });
  Ctx(res, cop).coSuccess();
}
/**
 * 修改用户信息后得修改缓存中的用户信息
 */
function resetCacheInfo(req, res) {
  const userType = getUserType(req);
  const uniqueId = loginUserUniqueId(req);
  logger.info(`ResetCacheInfo >> UniqueId ${uniqueId} SessionID ${req.sessionID}`);
  var cop = co(function*() {
    if (uniqueId) {
      var userInfo = yield* RedisUtils.getUserInfoByUniqueId(uniqueId);
      if (isUserInfoValid(userInfo)) {
        var userInfo = yield* getService(userType).findOne(parseInt(userInfo.eid));
        yield* RedisUtils.refreshUserInfo(uniqueId, userInfo);
        _.extend(req.session.userInfo, userInfo);
        return userInfo;
      } else {
        throw new Error(MsgTip.USER_NOT_LOGIN);
      }
    } else {
      throw new Error(MsgTip.USER_NOT_LOGIN);
    }
  });
  Ctx(res, cop).coSuccess();
}

exports.userRequest = userRequest;
exports.customerRequest = customerRequest;
exports.login = login;
exports.logout = logout;
exports.getCacheInfo = getCacheInfo;
exports.resetCacheInfo = resetCacheInfo;
