const TABLE_NAME = require('../const/table_ext').ORDER.name;
var BaseService = require('./base_service');
var PV = require('../utils/validation');
var Order = require('../bean/order');

class OrderService extends BaseService {

  *findPageList(pn, ps, filters) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).obj('Filters', filters).validate();
    if (pv_err) throw pv_err;
    return yield* super.findPageByFilter(pn, ps, filters);
  }

  transformOne(entity) {
    return entity && new Order().parseEntity(entity);
  }
}

module.exports = new OrderService(TABLE_NAME);