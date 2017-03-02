/**
 * Created by Charles on 16/6/7.
 * Object.prototype.toString.call()返回的数据类型
 */
const TypeTag = {
  NULL: '[object Null]',
  UNDEFINED: '[object Undefined]',
  NUMBER: '[object Number]',
  STRING: '[object String]',
  ARRAY: '[object Array]',
  BOOLEAN: '[object Boolean]',
  FUNCTION: '[object Function]',
  OBJECT: '[object Object]',
  SET: '[object Set]',
  MAP: '[object Map]',
  ERROR: '[object Error]',
  REGEXP: '[object RegExp]'
};
/**
 * 空字符串
 * @type {string}
 */
const EMPTY_STR = '';
/**
 * 代替call计算
 * The use of `Object#toString` avoids issues with the `typeof` operator
 * in older versions of Chrome and Safari which return 'function' for regexes
 * and Safari 8 which returns 'object' for typed array constructors.
 */
const compare = val => Object.prototype.toString.call(val);

const isNull = val => compare(val) === TypeTag.NULL;
const isUndefined = val => compare(val) === TypeTag.UNDEFINED;
const isNumber = val => compare(val) === TypeTag.NUMBER && !Number.isNaN(val);
const isString = val => compare(val) === TypeTag.STRING;
const isArray = val => compare(val) === TypeTag.ARRAY;
const isBoolean = val => compare(val) === TypeTag.BOOLEAN;
const isFunction = val => compare(val) === TypeTag.FUNCTION;
const isObject = val => compare(val) === TypeTag.OBJECT;
const isMap = val => compare(val) === TypeTag.MAP;
const isSet = val => compare(val) === TypeTag.SET;
const isError = val => compare(val) === TypeTag.ERROR || val instanceof Error;
const isRegExp = val => compare(val) === TypeTag.REGEXP;

const _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

const keyMirror = function (obj) {
  var key;
  var mirrored = {};
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        mirrored[key] = key;
      }
    }
  }
  return mirrored;
};

const isBlank = val => isNull(val) || isUndefined(val) || val === EMPTY_STR;
const isObjectEmpty = obj => {
  //对象{}存在为类型为"object"非"array"
  // return isObject(obj) && Object.getOwnPropertyNames(obj).length > 0 ? false : true;
  // if (obj && typeof obj === "object" && !(obj instanceof Array)) {
  if (isObject(obj)) {
    return Object.getOwnPropertyNames(obj).length > 0 ? false : true;
  }
  return true;
};
const isArrayEmpty = arr => (isArray(arr) && arr.length > 0) ? false : true;
const isMapEmpty = map => (isMap(map) && map.size > 0) ? false : true;

const arrJoinComma = (...arr) => arr && !isArrayEmpty(arr) && arr.join(',') || EMPTY_STR;
const arrJoinHyphen = (...arr) => arr && !isArrayEmpty(arr) && arr.join('-') || EMPTY_STR;
const arrJoinSlash = (...arr) => arr && !isArrayEmpty(arr) && arr.join('/') || EMPTY_STR;

const splitToParseInt = (str, d) => isString(str) && str && str.split(d).map(v => parseInt(v)) || str;

const getMapValues = map => isMap(map) && Array.from(map).map(arr => arr[1]) || [];

const formatMillis = millis => isNumber(millis) && new Date(millis).format('yyyy-MM-dd hh:mm');


//导出方法
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isMap = isMap;
exports.isSet = isSet;
exports.isError = isError;
exports.isRegExp = isRegExp;

exports._extends = _extends;
exports.keyMirror = keyMirror;

exports.isBlank = isBlank;
exports.isObjectEmpty = isObjectEmpty;
exports.isArrayEmpty = isArrayEmpty;
exports.isMapEmpty = isMapEmpty;


exports.arrJoinComma = arrJoinComma;
exports.arrJoinHyphen = arrJoinHyphen;
exports.arrJoinSlash = arrJoinSlash;

exports.splitToParseInt = splitToParseInt;

exports.getMapValues = getMapValues;

exports.formatMillis = formatMillis;