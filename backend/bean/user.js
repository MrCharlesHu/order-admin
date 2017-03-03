var CommonBean = require('./base_bean').CommonBean;

class User extends CommonBean {

  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
    this.avatar = null;
    this.level = null;
    this.type = null;
    this.remarks = null;
  }
}

module.exports = User;