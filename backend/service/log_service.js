const TABLE_NAME = require('../const/table_ext').LOG.name;
var BaseService = require('./base_service');
var PV = require('../utils/validation');
var Log = require('../bean/log');

class LogService extends BaseService {

  *findPageList(pn, ps) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).validate();
    if (pv_err) throw pv_err;
    return yield* super.findPageByFilter(pn, ps);
  }

  *saveLoginLog(userId, username, action, ip, browser) {
    var pv_err = PV().num('UserId', userId).str('Username', username).str('Action', action)
      .str("IP", ip).str("Browser", browser).validate();
    if (pv_err) throw pv_err;
    return yield* super.saveEntity(new Log(userId, username, action, ip, browser).toEntity());
  }

  transformOne(entity) {
    return entity && new Log().parseEntity(entity);
  }
}

module.exports = new LogService(TABLE_NAME);