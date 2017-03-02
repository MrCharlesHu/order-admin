var logger = require('../utils/logger').getLogger('user');
var router = require('express').Router();
var co = require('co');
var _ = require('lodash');
var Ctx = require('../contexts').CoCtx;
var userService = require('../service/user_service');
var logService = require('../service/log_service');
var RedisUtils = require('../connect/redis');
var {ip, userAgent} = require('../utils/req_utils');
const MsgTip = require('../const/msg_tip');
const PageRequest = require('../utils/pageable').PageRequest;
const isUserInfoValid = userInfo => userInfo && userInfo.eid;

router.post("/save", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var cop = co(function*() {
    return yield* userService.saveOne(username, password);
  });
  Ctx(res, cop).coSuccess();
});
/**
 * 用户登录
 */
router.post("/login", function (req, res) {
  const uniqueId = req.body.uniqueId;
  const username = req.body.username;
  const password = req.body.password;
  var cop = co(function*() {
    var userInfo = yield* userService.login(username, password);
    if (isUserInfoValid(userInfo)) {
      yield* logService.saveLoginLog(userInfo.eid, userInfo.username, '登录', ip(req), userAgent(req));
      yield* RedisUtils.cacheUserLoginInfo(uniqueId, userInfo);
      // req.session.userInfo = userInfo;
      return [uniqueId, userInfo];
    } else {
      throw new Error(MsgTip.LOGIN_INFO_WRONG);
    }
  });
  Ctx(res, cop).loginSuccess();
});
/**
 * 用户注销
 */
router.get('/logout', function (req, res) {
  const uniqueId = req.sessionID;
  logger.info('cookie', req.cookies);
  logger.info(`User logout uniqueId ${uniqueId}`);
  var cop = co(function*() {
    if (uniqueId) {
      var userInfo = yield* RedisUtils.getUserInfoByUniqueId(uniqueId);
      console.log(userInfo);
      yield* userService.logout(userInfo.eid, userInfo.account);
      var retObj = yield* RedisUtils.clearWhenUserLogout(req.sessionID, uniqueId);
      logger.info('After logout ', retObj, ' # ', req.session && req.session.userInfo);
      return {};
    } else {
      throw new Error(MsgTip.USER_NOT_LOGIN);
    }
  });
  Ctx(res, cop).coSuccess(MsgTip.LOGOUT_SUCCESS);
});
/**
 * 根据unionId从缓存中获取用户信息
 */
router.get('/cache/info', function (req, res) {
  const uniqueId = req.sessionID;
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
});

router.get("/page", function (req, res) {
  var pr = PageRequest.buildFromRequest(req);
  var cop = co(function*() {
    return yield* userService.findPageList(pr.pn, pr.ps);
  });
  Ctx(res, cop).coSuccess();
});
//
// router.post("/password", function (req, res) {
//   var userId = parseInt(req.body.userId);
//   var newPassword = req.body.newPassword;
//   var cop = co(function*() {
//     var returnObj = yield* userService.modifyPassword(userId, newPassword);
//     return returnObj;
//   });
//   Ctx(res, cop).coSuccess();
// });
//
// router.get("/delete/:userId", function (req, res) {
//   var userId = req.query.userId;
//   var cop = co(function*() {
//     return yield* userService.delete(userId);
//   });
//   Ctx(res, cop).coSuccess();
// });

module.exports = router;