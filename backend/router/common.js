var logger = require('../utils/logger').getLogger('user');
var router = require('express').Router();
var co = require('co');
var Ctx = require('../contexts').CoCtx;
var RedisUtils = require('../connect/redis');
const {isArrayEmpty} = require('../utils/objects');
const NUM_CONST = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * 删除Redis某个DB
 */
router.get('/redis/remove/:families', (req, res) => {
  var familiesStr = req.params.families;
  var familiesArr = familiesStr && familiesStr.split(',');
  var familyArr = !isArrayEmpty(familiesArr) && familiesArr.map(family => parseInt(family));
  var cop = co(function*() {
    var retArr = [];
    for (let family of familyArr) {
      if (NUM_CONST.indexOf(family) == -1) {
        throw TypeError('family error');
      }
      logger.info('Clear database', family);
      var keys = yield* RedisUtils.keys(family, '*');
      var client = RedisUtils.getClient(family);
      var multi = client.multi();
      keys.forEach(key => multi.del(key));
      var retObj = yield* RedisUtils.exec(multi);
      client.end();
      logger.info('redis db', client.selected_db, 'closed, connected:', client.connected,
        'closing:', client.closing);
      retArr.push(JSON.stringify(retObj));
    }
    return retArr;
  });
  Ctx(res, cop).coSuccess();
});

module.exports = router;