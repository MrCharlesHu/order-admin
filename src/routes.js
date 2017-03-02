import Login from "components/Login.vue";
import NotFound from "components/404.vue";
import Home from "components/Home.vue";
import Main from "components/Main.vue";
import Order from "components/order/Order.vue";
import Form from "components/order/Form.vue";
import user from "components/order/user.vue";
import UserAdd from "components/user/UserAdd.vue";
import UserList from "components/user/UserList.vue";
import Log from "components/log/Log.vue";

let routes = [{
  path: '/login',
  component: Login,
  name: '',
  hidden: true
}, {
  path: '/404',
  component: NotFound,
  name: '',
  hidden: true
}, {
  path: '/',
  component: Home,
  name: '订单管理',
  iconCls: 'el-icon-message',//图标样式class
  children: [
    {path: '/main', component: Main, name: '主页', hidden: true},
    {path: '/order/today', component: Order, name: '今日订单'},
    {path: '/order/yesterday', component: Form, name: '昨日订单'},
    {path: '/order/all', component: user, name: '所有订单'},
    {path: '/order/trash', component: Form, name: '垃圾站'}
  ]
}, {
  path: '/',
  component: Home,
  name: '系统设置',
  iconCls: 'fa fa-id-card-o',
  children: [
    {path: '/user/add', component: UserAdd, name: '添加管理员'},
    {path: '/user/list', component: UserList, name: '管理员列表'}
  ]
}, {
  path: '/',
  component: Home,
  name: '',
  iconCls: 'fa fa-address-card',
  leaf: true,//只有一个节点
  children: [
    {path: '/log', component: Log, name: '日志列表'}
  ]
}, {
  path: '*',
  hidden: true,
  redirect: {path: '/404'}
}];

export default routes;