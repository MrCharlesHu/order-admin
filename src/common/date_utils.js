var moment = require('moment');

export default {

  formatDate(date){
    return moment(date).format('YYYY-MM-DD');
  },

  formatTime(date) {
    return moment(date).format('hh:mm:ss');
  },

  formatDateTime(date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
  }
}