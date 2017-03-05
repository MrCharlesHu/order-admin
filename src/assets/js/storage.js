import UUID from "uuid";
import {UNIQUE_ID, USER_LOGIN_KEY} from "assets/js/constants";

export default {

  getUniqueId(){
    let uniqueId = localStorage.getItem(UNIQUE_ID);//login unique key
    if (!uniqueId) {
      uniqueId = UUID.v1().split('-').join('');
      localStorage.setItem(UNIQUE_ID, uniqueId);
    }
    return uniqueId;
  },

  saveLoginInfo(userInfo){
    if (!userInfo) {
      return;
    }
    sessionStorage.setItem(USER_LOGIN_KEY, JSON.stringify(userInfo));
  },

  getLoginInfo(){
    var userInfo = sessionStorage.getItem(USER_LOGIN_KEY);
    return userInfo && JSON.parse(userInfo);
  },

  getLoginUsername(){
    var loginInfo = this.getLoginInfo();
    return loginInfo && loginInfo.username;
  },

  clearLoginInfo(){
    sessionStorage.removeItem(USER_LOGIN_KEY);
    localStorage.removeItem(UNIQUE_ID);
  }
}