var CommonBean = require('./base_bean').CommonBean;

class User extends CommonBean {

  constructor(username, password) {
    super();
    this.username = username;
    this.password = password;
    this.avatar = 'http://img1.imgtn.bdimg.com/it/u=1300006157,914742081&fm=214&gp=0.jpg';
    this.level = 1;
    this.type = 1;
    this.remarks = null;
  }
}

module.exports = User;