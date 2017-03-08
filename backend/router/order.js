var router = require('express').Router();
var co = require('co');
var fs = require('fs');
var fse = require('fs-extra')
var path = require('path');
var xlsx = require('node-xlsx');
var Ctx = require('../contexts').CoCtx;
var orderService = require('../service/order_service');
const splitToParseInt = require('../utils/objects').splitToParseInt;
const {ACTIVE, DELETED} = require('../const/active_type');
const PageRequest = require('../utils/pageable').PageRequest;
const Filters = require('../utils/filters').Filters;
const Order = require('../bean/order');

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

router.post("/save", function (req, res) {
  var order = new Order(req.body);
  order.setOtherProps(req);
  console.log(order);
  co(function*() {
    return yield* orderService.saveEntity(order);
  }).then(data => {
    res.send('订购成功，请静等收货吧！');
  }).catch(err => {
    Ctx(res).error(err);
  });
});

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

router.get("/export", function (req, res) {
  // var filters = orderFilter(req, ACTIVE);
  const now = new Date();
  const sheetName = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + '之前全部';
  const fileName = sheetName + '.xlsx';
  const fileDir = path.resolve(__dirname, '../../temp');
  const filePath = fileDir + '/' + fileName;
  co(function*() {
    var exportData = yield* orderService.findExportDataList(new Filters());
    var buffer = xlsx.build([{name: sheetName, data: exportData}]);
    fse.emptyDirSync(fileDir);
    fs.writeFileSync(filePath, buffer, 'binary');
    return buffer;
  }).then(buffer => {
    // res.send(buffer);
    res.download(filePath);
  }).catch(err => {
    Ctx(res).error(err);
  });
});

module.exports = router;