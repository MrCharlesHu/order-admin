var CommonBean = require('./base_bean').CommonBean;
var ReqUtils = require('../utils/req_utils');

class Order extends CommonBean {

  constructor(_BODY) {
    super();
    _BODY = _BODY || {};
    this.customer = _BODY.realName;
    this.phone = _BODY.mobile;
    this.product = _BODY.goodsName;
    this.address = _BODY.prov + _BODY.city + _BODY.dist + _BODY.address;
    this.mobileOS = _BODY.mobileOS;
    this.originUrl = _BODY.adSource;
    this.ip = _BODY.ip;
    this.payment = _BODY.pay;
    this.remarks = _BODY.key1;
  }

  setOtherProps(req) {
    var userAgent = ReqUtils.userAgent(req);
    if (userAgent.indexOf('iPhone') > -1) {
      this.mobileOS = 'iOS';
    } else if (userAgent.indexOf('Android') > -1) {
      this.mobileOS = 'Android';
    } else {
      this.mobileOS = 'Others';
    }
    this.ip = ReqUtils.ip(req);
  }
}

module.exports = Order;

// adSource:file:///Users/Charles/Downloads/wwwroot/mrgrassroots/wwwroot/m6/index.html
//   dir:file:///Users/Charles/Downloads/wwwroot/mrgrassroots/wwwroot/m6/index.html
//     goodsName:八核64GB双4G智能手机599元 金色
// realName:胡斌
// mobile:17701618907
// prov:
//   city:
//     dist:
//       address:上海市徐汇区桂林路396号一号楼312室
// pay:cod
// key1:是的发声发声
// Name?ac=ordervomnibar.html
