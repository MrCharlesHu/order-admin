const {isObjectEmpty, isArrayEmpty} = require('../utils/objects');
/**
 * 查询过滤器
 * @param field
 * @param comp
 * @param value
 * @constructor
 */
function Filter(field, comp, value) {
  this.field = field;
  this.comp = comp;
  this.value = value;
}
function Filters() {
  this.filters = [];
}
/**
 * @param field
 * @param value
 * @returns {Filters}
 */
Filters.prototype.eq = function (field, value) {
  this.filters.push(new Filter(field, '=', value));
  return this;
};
/**
 * @param field
 * @param value
 * @returns {Filters}
 */
Filters.prototype.gt = function (field, value) {
  this.filters.push(new Filter(field, '>=', value));
  return this;
};
/**
 * @param field
 * @param value
 * @returns {Filters}
 */
Filters.prototype.lt = function (field, value) {
  this.filters.push(new Filter(field, '<=', value));
  return this;
};
/**
 * @param field
 * @param value
 * @returns {Filters}
 */
Filters.prototype.gte = function (field, value) {
  this.filters.push(new Filter(field, '>=', value));
  return this;
};
/**
 * @param field
 * @param value
 * @returns {Filters}
 */
Filters.prototype.lte = function (field, value) {
  this.filters.push(new Filter(field, '<=', value));
  return this;
};
/**
 * @returns {Object}
 */
Filters.prototype.toObject = function () {
  var obj = {};
  for (let filter of this.filters) {
    obj[filter.field] = filter.value;
  }
  return obj;
};
Filters.prototype.isEmpty = function () {
  return this.filters.length > 0;
};
/**
 * @param filters2
 * @returns {Filters}
 */
Filters.prototype.concat = function (filters2) {
  if (filters2 instanceof Filters && !filters2.isEmpty()) {
    for (let filter of filters2) {
      this.filters.push(filter);
    }
  }
  return this;
};
Filters.prototype[Symbol.iterator] = function () {
  var index = -1;
  var data = this.filters;
  return {
    next: function () {
      return {value: data[++index], done: !(index in data)}
    }
  };
};

/**
 * 查询条件
 * @type {Filters}
 */
exports.Filters = Filters;