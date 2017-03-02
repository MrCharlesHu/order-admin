var _ = require('lodash');
const TableInfo = require('../const/table_ext');
const REMOVABLE_PROPS = ['ctime', 'mtime', 'deleted'];//返回的数据里不包含这些字段
const ACTIVE = require('../const/active_type').ACTIVE;
const isArrayEmpty = require('../utils/objects').isArrayEmpty;
const parseToInt = require('../utils/value_parser').parseToInt;

class BaseBean {

  constructor(eid) {
    this.eid = parseToInt(eid);
    this.ctime = new Date();
  }

  /**
   * 把bean转换成数据待保存的对象
   * @returns {object}
   */
  toEntity() {
    var map = this._lowercaseFieldWithValueToMap(this);
    const clazzName = this.constructor.name;
    var tableName = _.snakeCase(clazzName).toUpperCase();
    //fields保存除id之外的所有字段
    var fields = _.clone(TableInfo[tableName]['fields']);
    fields.shift();
    //retObj保存根据fields的字段名获取map的字段值
    var self = this;
    var retObj = {};
    for (let val of fields) {
      let _prop_ = self._toLowerCase(val);
      retObj[val] = map.get(_prop_);
    }
    return retObj;
  }

  /**
   * 把数据库实例转换成bean
   * @param entity
   * @param hide_props
   * @returns {CommonBean}
   */
  parseEntity(entity) {
    var map = this._lowercaseFieldWithValueToMap(entity);
    var self = this;
    for (let prop in this) {
      let _prop_ = self._toLowerCase(prop);
      self[prop] = map.get(_prop_);
    }
    return self;
  }

  setPropsEmpty(props) {
    props = props || REMOVABLE_PROPS;
    if (isArrayEmpty(props)) return;
    var self = this;
    for (let prop in this) {
      if (props.indexOf(prop) > -1 && self[prop]) {
        self[prop] = undefined;
      }
    }
    return self;
  }

  /**
   * map保存当前字段变成小写和值映射成key-value
   * @returns {Map}
   * @protected
   */
  _lowercaseFieldWithValueToMap(object) {
    var self = this;
    var map = new Map();
    for (let prop in object) {
      let p = self._toLowerCase(prop);
      map.set(p, object[prop]);
    }
    return map;
  }

  /**
   * 去掉字段中的下划线并转换成小写
   * @param value
   * @returns {string}
   * @protected
   */
  _toLowerCase(value) {
    return value && (value.split('_').join('').toLowerCase());
  }
}

class CommonBean extends BaseBean {
  constructor(eid) {
    super(eid);
    this.mtime = new Date();
    this.deleted = ACTIVE;
  }
}

exports.BaseBean = BaseBean;
exports.CommonBean = CommonBean;