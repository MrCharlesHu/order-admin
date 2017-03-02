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
Filters.prototype.eq = function (field, value) {
  this.filters.push(new Filter(field, '=', value));
  return this;
};
Filters.prototype.gt = function (field, value) {
  this.filters.push(new Filter(field, '>=', value));
  return this;
};
Filters.prototype.lt = function (field, value) {
  this.filters.push(new Filter(field, '<=', value));
  return this;
};
Filters.prototype.gte = function (field, value) {
  this.filters.push(new Filter(field, '>=', value));
  return this;
};
Filters.prototype.lte = function (field, value) {
  this.filters.push(new Filter(field, '<=', value));
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

exports.Filters = Filters;