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
    var rows = yield* super.findListByFilter({username: username, password: password});
    if (isArrayEmpty(rows) || isObjectEmpty(rows[0])) {
      throw new Error(MsgTip.LOGIN_INFO_WRONG);
    }
    return rows[0];
  }

  *findPageList(pn, ps) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).validate();
    if (pv_err) throw pv_err;
    return yield* super.findPageByFilter(pn, ps);
  }

  // /**
  //  * 商品更新时更新标签
  //  * @param {number} productId
  //  * @param {number} commodityId
  //  * @returns {*}
  //  */
  // *updateOne(productId, commodityId) {
  //   var pv_err = PV().num('商品标签ID', commodityId).num('商品ID', productId).validate();
  //   if (pv_err) throw pv_err;
  //   return yield* super.updateEntities({'product_id': productId}, {'commodity_id': commodityId});
  // }

  // /**
  //  * 商品下架的时候删除记录
  //  * @param {number} productId
  //  * @returns {*}
  //  */
  // *deleteOneWhenProductIsTakenDown(productId) {
  //   var pv_err = PV().num('商品ID', productId).validate();
  //   if (pv_err) throw pv_err;
  //   return yield* super.deleteEntities({product_id: productId});
  // }

  getFilters(filters) {
    return new Filters().eq('deleted', ACTIVE).concat(filters);
  }

  transformOne(entity) {
    return entity && new User().parseEntity(entity);
  }
}

module.exports = new UserService(TABLE_NAME);