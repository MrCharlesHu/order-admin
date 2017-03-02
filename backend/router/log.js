var router = require('express').Router();
var co = require('co');
var Ctx = require('../contexts').CoCtx;
var logService = require('../service/log_service');
const PageRequest = require('../utils/pageable').PageRequest;

router.get("/page", function (req, res) {
  var pr = PageRequest.buildFromRequest(req);
  var cop = co(function*() {
    return yield* logService.findPageList(pr.pn, pr.ps);
  });
  Ctx(res, cop).coSuccess();
});

module.exports = router;