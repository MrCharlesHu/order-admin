var crypto = require("crypto");
/**
 * 获得md5加密后的密码
 * @param {String} raw_password 未加密的密码
 * @returns {*}
 */
exports.getMd5Password = function (raw_password) {
  return raw_password ? (crypto.createHash("md5").update(raw_password).digest("hex")) : undefined;
};

exports.setNullIfEmpty = function (value) {
  return value ? value : null;
};

exports.parseToBool = function (value) {
  return value ? (JSON.parse(value) ? true : false) : null;
};

exports.parseToInt = function (value) {
  return value ? parseInt(value) : null;
};

exports.parseToFloat = function (value) {
  return value ? parseFloat(value) : null;
};

exports.parseToDate = function (value) {
  return value ? new Date(value) : null;
};