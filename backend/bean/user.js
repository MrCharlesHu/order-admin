var CommonBean = require('./base_bean').CommonBean;

class User extends CommonBean {

  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
  }
}

module.exports = User;