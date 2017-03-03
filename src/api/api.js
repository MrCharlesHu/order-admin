import axios from "axios";

const base = '/api';

export const userLogin = params => {
  return axios.post(`${base}/user/login`, params).then(res => res.data);
};

export const getUserPage = params => {
  return axios.get(`${base}/user/page`, {params: params}).then(res => res.data);
};

export const deleteUser = userId => {
  return axios.get(`${base}/user/delone/${userId}`).then(res => res.data);
};

export const deleteUsers = userIds => {
  return axios.get(`${base}/user/delbat/${userIds}`).then(res => res.data);
};

export const addUser = params => {
  return axios.post(`${base}/user/save`, params).then(res => res.data);
};

export const editUser = params => {
  return axios.post(`${base}/user/edit`, params).then(res => res.data);
};

export const getOrderPage = params => {
  return axios.get(`${base}/order/page`, {params: params}).then(res => res.data);
};

export const getOrderTrash = params => {
  return axios.get(`${base}/order/trash`, {params: params}).then(res => res.data);
};

export const deleteOrder = eid => {
  return axios.get(`${base}/order/delone/${eid}`).then(res => res.data);
};

export const deleteOrders = eids => {
  return axios.get(`${base}/order/delbat/${eids}`).then(res => res.data);
};

export const getLogPage = params => {
  return axios.get(`${base}/log/page`, {params: params}).then(res => res.data);
};