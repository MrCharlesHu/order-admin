var router = require('express').Router();
var co = require('co');
var Ctx = require('../contexts').CoCtx;
var orderService = require('../service/order_service');
const ACTIVE = require('../const/active_type').ACTIVE;
const PageRequest = require('../utils/pageable').PageRequest;
const Filters = require('../utils/filters').Filters;

router.get("/page", function (req, res) {
  var pr = PageRequest.buildFromRequest(req);
  var fromDate = req.query.from + ' 00:00:00';
  var toDate = req.query.to + ' 23:59:59';
  var cop = co(function*() {
    var filters = new Filters();
    filters.eq('deleted', ACTIVE);
    if (fromDate && toDate) {
      filters.gte('ctime', fromDate).lte('ctime', toDate);
    }
    return yield* orderService.findPageList(pr.pn, pr.ps, filters);
  });
  Ctx(res, cop).coSuccess();
});

module.exports = router;