import axios from "axios";

let base = '';
let API_PREFIX = '/api';

export const getOrderPage = params => {
  return axios.get(`${API_PREFIX}/order/page`, {params: params});
};

export const userLogin = params => {
  return axios.post(`${API_PREFIX}/user/login`, params).then(res => res.data);
};

export const getUserList = params => {
  return axios.get(`${API_PREFIX}/user/page`, {params: params});
};

export const removeUser = params => {
  return axios.get(`${base}/user/remove`, {params: params});
};

export const batchRemoveUser = params => {
  return axios.get(`${base}/user/batchremove`, {params: params});
};

export const editUser = params => {
  return axios.get(`${base}/user/edit`, {params: params});
};

export const addUser = params => {
  return axios.get(`${base}/user/add`, {params: params});
};

export const getLogPage = () => {
  return axios.get(`${API_PREFIX}/log/page`);
};