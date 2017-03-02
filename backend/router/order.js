var router = require('express').Router();
var co = require('co');
var Ctx = require('../contexts').CoCtx;
var orderService = require('../service/order_service');
const splitToParseInt = require('../utils/objects').splitToParseInt;
const {ACTIVE, DELETED} = require('../const/active_type');
const PageRequest = require('../utils/pageable').PageRequest;
const Filters = require('../utils/filters').Filters;

function orderFilter(req, deleted) {
  var filters = new Filters();
  filters.eq('deleted', deleted);
  var fromDate = req.query.from + ' 00:00:00';
  var toDate = req.query.to + ' 23:59:59';
  if (fromDate && toDate) {
    filters.gte('ctime', fromDate).lte('ctime', toDate);
  }
  return filters;
}

router.get("/page", function (req, res) {
  var pr = PageRequest.buildFromRequest(req);
  var filters = orderFilter(req, ACTIVE);
  var cop = co(function*() {
    return yield* orderService.findPageList(pr.pn, pr.ps, filters);
  });
  Ctx(res, cop).coSuccess();
});

router.get("/trash", function (req, res) {
  var pr = PageRequest.buildFromRequest(req);
  var filters = orderFilter(req, DELETED);
  var cop = co(function*() {
    return yield* orderService.findPageList(pr.pn, pr.ps, filters);
  });
  Ctx(res, cop).coSuccess();
});

router.get("/delone/:orderId", function (req, res) {
  var orderId = req.params.orderId;
  var cop = co(function*() {
    return yield* orderService.deleteOne(orderId && parseInt(orderId));
  });
  Ctx(res, cop).coSuccess();
});

router.get("/delbat/:orderIds", function (req, res) {
  var orderIds = req.params.orderIds;
  var cop = co(function*() {
    return yield* orderService.deleteBatch(splitToParseInt(orderIds, ','));
  });
  Ctx(res, cop).coSuccess();
});

module.exports = router;