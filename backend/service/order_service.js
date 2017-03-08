const TABLE_NAME = require('../const/table_ext').ORDER.name;
var BaseService = require('./base_service');
var PV = require('../utils/validation');
var Order = require('../bean/order');
const Sort = require('../utils/pageable').Sort;
const {isArrayEmpty, formatMillis}  = require('../utils/objects');

class OrderService extends BaseService {

  *saveEntity(entity) {
    var pv_err = PV().str('客户', entity.customer).str('手机号', entity.phone).str('产品名',
      entity.product).str('地址', entity.address).str('页面地址', entity.originUrl).validate();
    if (pv_err) throw pv_err;
    return yield* super.saveEntity(entity.toEntity());
  }

  *findPageList(pn, ps, filters) {
    var pv_err = PV().num('PageNumber', pn).num('PageSize', ps).obj('Filters', filters).validate();
    if (pv_err) throw pv_err;
    return yield* super.findPageByFilter(pn, ps, filters, Sort().desc('ctime'));
  }

  *deleteOne(orderId) {
    var pv_err = PV().num('OrderId', orderId).validate();
    if (pv_err) throw pv_err;
    return yield* super.deleteEntityById(orderId);
  }

  *deleteBatch(orderIds) {
    var pv_err = PV().arr('OrderIds', orderIds).validate();
    if (pv_err) throw pv_err;
    return yield* super.deleteEntitiesByIds(orderIds);
  }

  *findExportDataList(filters) {
    // var pv_err = PV().obj('Filters', filters).validate();
    // if (pv_err) throw pv_err;
    var orders = yield* super.findListByFilter(filters);
    var resultArr = [['订单号', '客户名', '手机号码', '订购产品', '收货地址', '系统', '来源', '提交时间', '留言', 'IP']];
    if (!isArrayEmpty(orders)) {
      for (let order of orders) {
        resultArr.push([order.eid, order.customer, order.phone, order.product, order.address,
          order.mobileOS, order.originUrl, formatMillis(order.ctime), order.remarks, order.ip]);
      }
    }
    return resultArr;
  }

  transformOne(entity) {
    return entity && new Order().parseEntity(entity);
  }
}

module.exports = new OrderService(TABLE_NAME);