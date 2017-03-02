const _ = require('./objects');
/**
 * 多个validator的验证关系
 */
const RELATION = _.keyMirror({AND: null, OR: null});
/**
 * 验证类型
 */
const Type = _.keyMirror({
  EXIST: null,
  BOOLEAN: null,
  NUMBER: null,
  STRING: null,
  ARRAY: null,
  MAP: null,
  OBJECT: null,
  REGEXP: null,
  IN: null
});
/**
 * 验证数据信息
 * @param relation
 * @param type
 * @param name
 * @param value
 * @param target
 * @constructor
 */
function Validator(relation, type, name, value, target) {
  this.relation = relation;
  this.type = type;
  this.name = name;
  this.value = value;
  this.target = target;
}
/**
 * 通过返回false
 * @returns {*}
 */
Validator.prototype.exec = function () {
  switch (this.type) {
    case Type.EXIST:
      const nullValue = _.isNull(this.value) || _.isUndefined(this.value);
      return (nullValue || !(new String(this.value)).length) && this.name;
      break;
    case Type.BOOLEAN:
      return !_.isBoolean(this.value) && this.name;
      break;
    case Type.NUMBER:
      return !_.isNumber(this.value) && this.name;
      break;
    case Type.STRING:
      return !_.isString(this.value) && this.name;
      break;
    case Type.ARRAY:
      return !_.isArray(this.value) && this.name;
      break;
    case Type.MAP:
      return !_.isMap(this.value) && this.name;
      break;
    case Type.OBJECT:
      return !_.isObject(this.value) && this.name;
      break;
    case Type.REGEXP:
      return !(_.isRegExp(this.target) && this.target.test(this.value)) && this.name;
      break;
    case Type.IN:
      if (_.isArray(this.target)) {
        let exist = this.target.find(v => v === this.value);
        return !exist && this.name;
      } else {
        return !(this.target === this.value) && this.name;
      }
      break;
    default:
      console.error('Parameter validation error!');
      return 'Parameter validate error';
      break;
  }
};
/**
 * 验证参数是否为空,类型是否正确
 */
function Validation() {
  this.validators = [];
}
/**
 * 元素存在就可以
 * @returns {Validation}
 */
Validation.prototype.exist = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.EXIST, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.bool = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.BOOLEAN, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.num = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.NUMBER, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.str = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.STRING, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.arr = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.ARRAY, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.map = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.MAP, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.obj = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.OBJECT, name, value, target);
};
/**
 * @returns {Validation}
 */
Validation.prototype.regExp = function (name, value, regExp) {
  return this.addValidator(RELATION.AND, Type.REGEXP, name, value, regExp);
};
/**
 * @params {Array} target 'in'的待匹配值
 * @returns {Validation}
 */
Validation.prototype.in = function (name, value, target) {
  return this.addValidator(RELATION.AND, Type.IN, name, value, target);
};
/**
 * 参数可为空的或验证
 * value为null或undefined或''时可不加入验证,此外的值都是AND操作验证
 * @returns {Validation}
 */
Validation.prototype.nullableOR = function (func) {
  if (!_.isFunction(func)) throw TypeError('Invalid validation param type');
  let pv_temp = new Validation();
  func.bind(pv_temp)();
  pv_temp.validators.forEach(v => {
    this.addValidator(_.isBlank(v.value) ? RELATION.OR : RELATION.AND, v.type, v.name, v.value, v.target);
  });
  return this;
};
/**
 * @returns {Validation}
 * @private
 */
Validation.prototype.addValidator = function (relation, type, name, value, target) {
  this.validators.push(new Validator(relation, type, name, value, target));
  return this;
};
/**
 * 验证参数是否合法
 * @returns {*|TypeError}
 */
Validation.prototype.validate = function () {
  if (_.isArrayEmpty(this.validators)) {
    return new TypeError('参数调用错误');
  }
  //有一个不符合抛错
  let validator_and = this.validators.filter(v => v.relation == RELATION.AND).find(v => v.exec());
  if (validator_and) return new TypeError(validator_and.name + '类型错误');
  //没有一个符合且抛错
  let errorText = false, isOneValid = false;
  this.validators.filter(v => v.relation == RELATION.OR).forEach(v => {
    let result = v.exec();
    if (!_.isBlank(v.value)) errorText = result;//保存有值传入参数对应的name,注意NaN
    isOneValid = !result;
  });
  if (!isOneValid && errorText) return new TypeError(errorText + '类型错误');
  return undefined;
};
/**
 * 参数验证
 * @returns {Validation}
 */
module.exports = function () {
  return new Validation();
};
/**
 * Created by Charles on 2017/2/25.
 */
