const BASE_PROPS = ['eid', 'ctime'];
const COMMON_PROPS = BASE_PROPS.concat(['mtime', 'deleted']);
/**
 * 建表字段信息
 */
const TableInfo = {
  /**
   * 管理员
   */
  USER: {
    name: 'user',
    fields: COMMON_PROPS.concat(['username', 'password', 'avatar', 'level', 'type', 'remarks'])
  },
  /**
   * 订单
   */
  ORDER: {
    name: 'order',
    fields: COMMON_PROPS.concat(['customer', 'phone', 'product', 'address', 'payment',
      'mobile_os', 'origin_url', 'ip', 'remarks'])
  },
  /**
   * 管理员操作日志
   */
  LOG: {
    name: 'log',
    fields: BASE_PROPS.concat(['user_id', 'username', 'action', 'ip', 'browser'])
  }
};

module.exports = TableInfo;