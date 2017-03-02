var BaseBean = require('./base_bean').BaseBean;

class Log extends BaseBean {

  constructor(userId, username, action, ip, browser) {
    super();
    this.userId = userId;
    this.username = username;
    this.action = action;
    this.ip = ip;
    this.browser = browser;
  }
}

module.exports = Log;