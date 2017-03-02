module.exports = {
  /**
   * 去掉中间的横杠号
   * @returns {*}
   */
  ip: function (req) {
    let ip = /\d+\.\d+\.\d+\.\d/g.exec(req.ip);
    if (ip.length > 0) {
      ip = ip[0];
    } else {
      ip = ApiConn.host;
    }
    return ip;
  },
  /**
   * 用户代理
   * @param req
   */
  userAgent: function (req) {
    return req.header('user-agent');
  },
  /**
   * 用户id
   * @param req
   * @returns {*|Number}
   */
  loginUserEid: function (req) {
    const userInfo = req.session.userInfo;
    return userInfo && userInfo.eid && parseInt(userInfo.eid);
  },
  /**
   * 用户账号
   * @param req
   * @returns {*|String}
   */
  loginUsername: function (req) {
    const userInfo = req.session.userInfo;
    return userInfo && userInfo.username;
  }
};

