const TABLE_NAME = require('../const/table_ext').USER.name;
var BaseService = require('./base_service');
var PV = require('../utils/validation');
var User = require('../bean/user');
const Filters = require('../utils/filters').Filters;
const MsgTip = require('../const/msg_tip');
const {isArrayEmpty, isObjectEmpty} = require('../utils/objects');
const ACTIVE = require('../const/active_type').ACTIVE;

class UserService extends BaseService {

  *saveOne(username, password) {
    var pv_err = PV().str('用户名', username).str('用户密码', password).validate();
    if (pv_err) throw pv_err;
    return yield* super.saveEntity(new User(username, password).toEntity());
  }

  *login(username, password) {
    var pv_err = PV().str('用户名', username).str('密码', password).validate();
    if (pv_err) throw pv_err;
    var rows = yield* super.findListByFilter(new Filters({username: username, password: password}));
    if (isArrayEmpty(rows) || isObjectEmpty(rows[0])) {
      throw new Error(MsgTip.LOGIN_INFO_WRONG);
    }
    return rows[0];
  }

  *findPageList(pn, ps, username) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).validate();
    if (pv_err) throw pv_err;
    var filters = username ? new Filters({username: username}) : null;
    return yield* super.findPageByFilter(pn, ps, filters);
  }

  *updateOne(userId, username, password) {
    var pv_err = PV().num('UserId', userId).str('Username', username).str('Password', password).validate();
    if (pv_err) throw pv_err;
    var userInfo = yield* super.findOneById(userId);
    if (!userInfo) {
      throw new Error(MsgTip.USER_NOT_EXIST);
    } else {
      return yield* super.updateEntityById(userId, {username: username, password: password});
    }
  }

  *deleteOne(userId) {
    var pv_err = PV().num('UserId', userId).validate();
    if (pv_err) throw pv_err;
    var userInfo = yield* super.findOneById(userId);
    if (userInfo.username == 'admin') {
      throw new Error(MsgTip.DEFAULT_ADMIN);
    } else {
      return yield* super.deleteEntityById(userId);
    }
  }

  *deleteBatch(userIds) {
    var pv_err = PV().arr('UserIds', userIds).validate();
    if (pv_err) throw pv_err;
    return yield* super.deleteEntitiesByIds(userIds);
  }

  getFilters(filters) {
    return new Filters({deleted: ACTIVE}).concat(filters);
  }

  transformOne(entity) {
    return entity && new User().parseEntity(entity);
  }
}

module.exports = new UserService(TABLE_NAME);