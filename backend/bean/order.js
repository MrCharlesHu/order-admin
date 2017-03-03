var CommonBean = require('./base_bean').CommonBean;

class Order extends CommonBean {

  constructor(_BODY) {
    super();
    _BODY = _BODY || {};
    this.customer = _BODY.customer;
    this.phone = _BODY.phone;
    this.product = _BODY.product;
    this.address = _BODY.address;
    this.mobileOS = _BODY.mobileOS;
    this.originUrl = _BODY.originUrl;
    this.ip = _BODY.ip;
    this.remarks = _BODY.remarks;
  }
}

module.exports = Order;