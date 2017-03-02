const Direction = {ASC: 'asc', DESC: 'desc'};
/**
 * 多个排序对象
 * @constructor
 */
function Sort() {
  this.orders = new Map();
}
/**
 * 升序
 * @param {string} property
 * @returns {Sort}
 */
Sort.prototype.asc = function (property) {
  this.orders.set(property, Direction.ASC);
  return this;
};
/**
 * 降序
 * @param {string} property
 * @returns {Sort}
 */
Sort.prototype.desc = function (property) {
  this.orders.set(property, Direction.DESC);
  return this;
};
/**
 * 获取所有的排序
 * @returns {Array.<Array<string,string>>}
 */
Sort.prototype.getOrders = function () {
  return Array.from(this.orders);
};
/**
 * 获取排序的长度
 * @returns {number}
 */
Sort.prototype.length = function () {
  return this.orders.size;
};

/**
 * 分页请求对象
 * @constructor
 */
function PageRequest(pn, ps, sort) {
  this.pn = pn && parseInt(pn) || PageRequest.DEFAULT_PN;
  this.ps = ps && parseInt(ps) || PageRequest.DEFAULT_PS;
  this.sort = sort;
}
/**
 * 从Request构造PageRequest
 * @param {IncomingMessage} req
 * @static
 * @returns {PageRequest}
 */
PageRequest.buildFromRequest = function (req) {
  return new PageRequest(req.query.pn, req.query.ps, undefined);
};
/**
 * 默认分页
 * @type {number}
 * @static
 */
PageRequest.DEFAULT_PN = 1;
/**
 * 默认分页每页页数
 * @type {number}
 * @static
 */
PageRequest.DEFAULT_PS = 10;

/**
 * 分页返回对象
 * @constructor
 */
function Page(total, items, pageNumber, pageSize) {
  this.total = total || 0;
  this.items = items || [];
  this.pn = pageNumber || PageRequest.DEFAULT_PN;
  this.ps = pageSize || PageRequest.DEFAULT_PS;
}

/**
 * @returns {Sort}
 * @constructor
 */
exports.Sort = function () {
  return new Sort();
};
exports.PageRequest = PageRequest;
exports.Page = Page;

// example
// var PG = require('../core/data/pageable');
// var sort = new PG.Sort([PG.Order.asc('name'), PG.Order.desc('age')]);
// var pageable = new PG.PageRequest(1, 2, sort);
