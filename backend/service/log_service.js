const TABLE_NAME = require('../const/table_ext').LOG.name;
var BaseService = require('./base_service');
var PV = require('../utils/validation');
var Log = require('../bean/log');
var logger = require('../utils/logger').getLogger('log-service');
const Sort = require('../utils/pageable').Sort;
const Filters = require('../utils/filters').Filters;

class LogService extends BaseService {

  *findPageList(pn, ps, username) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).validate();
    if (pv_err) throw pv_err;
    var filters = username ? new Filters({username: username}) : null;
    return yield* super.findPageByFilter(pn, ps, filters, Sort().desc('ctime'));
  }

  *saveLoginLog(userId, username, action, ip, browser) {
    var pv_err = PV().num('UserId', userId).str('Username', username).str('Action', action)
      .str("IP", ip).str("Browser", browser).validate();
    if (pv_err) throw pv_err;
    logger.info(`UserId:${userId} | Username:${username} | IP:${ip} 登录`);
    return yield* super.saveEntity(new Log(userId, username, action, ip, browser).toEntity());
  }

  transformOne(entity) {
    return entity && new Log().parseEntity(entity);
  }
}

module.exports = new LogService(TABLE_NAME);