import axios from "axios";

let API_PREFIX = '/api';

export const userLogin = params => {
  return axios.post(`${API_PREFIX}/user/login`, params).then(res => res.data);
};

export const getUserList = params => {
  return axios.get(`${API_PREFIX}/user/page`, {params: params});
};

export const batchRemoveUser = params => {
  return axios.get(`${API_PREFIX}/user/batchremove`, {params: params});
};

export const editUser = params => {
  return axios.get(`${API_PREFIX}/user/edit`, {params: params});
};

export const addUser = params => {
  return axios.get(`${API_PREFIX}/user/add`, {params: params});
};

export const getOrderPage = params => {
  return axios.get(`${API_PREFIX}/order/page`, {params: params});
};

export const getOrderTrash = params => {
  return axios.get(`${API_PREFIX}/order/trash`, {params: params});
};

export const deleteOrder = (eid) => {
  return axios.get(`${API_PREFIX}/order/delone/${eid}`);
};

export const deleteOrders = (eids) => {
  return axios.get(`${API_PREFIX}/order/delbat/${eids}`);
};

export const getLogPage = () => {
  return axios.get(`${API_PREFIX}/log/page`);
};