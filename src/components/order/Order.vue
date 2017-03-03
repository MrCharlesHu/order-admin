<template>
    <section key="order">
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item label="时间范围">
                    <el-date-picker v-model="filters.range" type="daterange" align="right" placeholder="时间范围"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="渠道">
                    <el-input v-model="filters.name" placeholder="渠道"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPageList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="exportExcel">导出</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="page.items" highlight-current-row v-loading="loading" @selection-change="selectedChange"
                  default-expand-all style="width: 100%;">
            <el-table-column type="selection" width="35"></el-table-column>
            <!--<el-table-column type="index" width="30"></el-table-column>-->
            <el-table-column prop="eid" label="单号" min-width="50"></el-table-column>
            <el-table-column prop="customer" label="客户名" width="70"></el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="110"></el-table-column>
            <!--<el-table-column prop="product" label="订购产品" min-width="160"></el-table-column>-->
            <el-table-column prop="address" label="收货地址" min-width="200"></el-table-column>
            <el-table-column prop="mobileOS" label="系统" width="80">
                <!--:filters="[{ text: 'iOS', value: 'iOS' }, { text: 'Android', value: 'Android' }]"-->
                <!--:filter-method="filterTag"-->
                <template scope="scope">
                    <el-tag :type="scope.row.mobileOS === 'iOS' ? 'primary' : 'success'" close-transition>
                        {{scope.row.mobileOS}}
                    </el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column prop="originUrl" label="来源" min-width="120"></el-table-column>-->
            <el-table-column prop="ctime" label="提交时间" min-width="140" :formatter="formatDateTime"
                             sortable></el-table-column>
            <el-table-column prop="remarks" label="留言" min-width="160"></el-table-column>
            <el-table-column prop="ip" label="IP" min-width="100"></el-table-column>
            <el-table-column label="操作" v-bind:min-width="operateWidth">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                    <el-button type="danger" size="small" @click="doDelete(scope.$index, scope.row)"
                               v-if="!isTrashMenu">删除
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column type="expand">
                <template scope="props">
                    <div class="order-expand-column">
                        <p>来源: {{ props.row.originUrl }}</p>
                        <p>订购产品: {{ props.row.product }}</p>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar table-footer">
            <el-button type="danger" @click="doBatchDelete" :disabled="this.selected.length===0">批量删除</el-button>
            <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="page.ps"
                           :total="page.total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog title="订单明细" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="单号" prop="eid">
                    <el-input v-model="editForm.eid" disabled></el-input>
                </el-form-item>
                <el-form-item label="客户名" prop="customer">
                    <el-input v-model="editForm.customer" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="editForm.phone" disabled></el-input>
                </el-form-item>
                <el-form-item label="订购产品" prop="phone">
                    <el-input v-model="editForm.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="收货地址" prop="address">
                    <el-input v-model="editForm.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="系统" prop="mobileOS">
                    <el-input v-model="editForm.mobileOS" disabled></el-input>
                </el-form-item>
                <el-form-item label="来源" prop="originUrl">
                    <el-input v-model="editForm.originUrl" disabled></el-input>
                </el-form-item>
                <!--<el-form-item label="性别">-->
                <!--<el-radio-group v-model="editForm.sex">-->
                <!--<el-radio class="radio" :label="1">男</el-radio>-->
                <!--<el-radio class="radio" :label="0">女</el-radio>-->
                <!--</el-radio-group>-->
                <!--</el-form-item>-->
                <el-form-item label="提交时间">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.ctime"
                                    disabled></el-date-picker>
                </el-form-item>
                <el-form-item label="留言" prop="remarks">
                    <el-input v-model="editForm.remarks" disabled></el-input>
                </el-form-item>
                <el-form-item label="IP" prop="ip">
                    <el-input v-model="editForm.ip" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <!--<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>-->
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import DateUtils from 'assets/js/date_utils'
  import NProgress from 'nprogress'
  import {DEFAULT_PAGE_SIZE} from 'assets/js/constants'
  import {getOrderPage, getOrderTrash, deleteOrder, deleteOrders} from 'api/api';

  export default {
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '上周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        filters: {
          range: [],
          name: ''
        },
        page: {
          total: 0,
          items: [],
          pn: 1,
          ps: DEFAULT_PAGE_SIZE
        },
        loading: false,
        selected: [],//列表选中列
        orderSwitch: 'today',

        //编辑界面是否显示
        editFormVisible: false,
        editLoading: false,
        //editFormRules: {name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]},
        //编辑界面数据
        editForm: {id: 0, name: '', sex: -1, age: 0, birth: '', addr: ''},

        //新增界面是否显示
        //addFormVisible: false,
        //addLoading: false,
        //addFormRules: {name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]},
        //新增界面数据
        //addForm: {name: '',sex: -1,age: 0,birth: '',addr: ''}
      }
    },
    watch: {
      '$route' (to, from) {
        this.resetFilterInput();
        this.getPageList();
      }
    },
    computed: {
      isTrashMenu: function () {
        return this.orderSwitch == 'trash';
      },
      operateWidth: function () {
        return this.isTrashMenu ? 60 : 120;
      }
    },
    methods: {
      formatDateTime: function (row, column) {
        return DateUtils.formatDateTime(row.ctime);
      },
      resetFilterInput(){
        this.orderSwitch = location.hash.split('/').pop();
        switch (this.orderSwitch) {
          case 'today' :
            this.filters.range = [Date.now(), Date.now()];
            break;
          case 'yesterday':
            this.filters.range = [Date.now() - 3600 * 1000 * 24, Date.now()];
            break;
          case 'all':
            this.filters.range = [Date.now() - 3600 * 1000 * 24 * 90, Date.now()];
            break;
          case 'trash':
            this.filters.range = [Date.now() - 3600 * 1000 * 24 * 90, Date.now()];
            break;
        }
        this.filters.name = '';
      },
      handleCurrentChange(val) {
        this.page.pn = val;
        this.getPageList();
      },
      filterTag(value, row) {
        return row.mobileOS === value;
      },
      //获取用户列表
      getPageList() {
        console.log(`OrderSwitch >> ${this.orderSwitch} | IsTrashMenu >> ${this.isTrashMenu} | OperationWidth >> ${this.operateWidth}`);
        this.loading = true;
        NProgress.start();
        let rangeArr = this.filters.range;
        let params = {
          pn: this.page.pn,
          ps: this.page.ps,
          from: DateUtils.formatDate(rangeArr[0]),
          to: DateUtils.formatDate(rangeArr[1]),
          name: this.filters.name
        };
        let promise = this.orderSwitch == 'trash' ? getOrderTrash(params) : getOrderPage(params);
        promise.then(({err, data, msg}) => {
          this.page.total = data.total;
          this.page.items = data.items;
          this.loading = false;
          NProgress.done();
        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //显示新增界面
      exportExcel: function () {
        this.addFormVisible = true;
        this.addForm = {name: '', sex: -1, age: 0, birth: '', addr: ''};
      },
      selectedChange: function (selected) {
        this.selected = selected;
      },
      //删除
      doDelete: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          NProgress.start();
          deleteOrder(row.eid).then(({err, data, msg}) => {
            this.loading = false;
            NProgress.done();
            this.$notify({title: '成功', message: '删除成功', type: 'success'});
            this.getPageList();
          });
        }).catch(() => {
        });
      },
      //批量删除
      doBatchDelete: function () {
        var orderIds = this.selected.map(item => item.eid).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          NProgress.start();
          deleteOrders(orderIds).then(({err, data, msg}) => {
            this.loading = false;
            NProgress.done();
            this.$notify({title: '成功', message: '删除成功', type: 'success'});
            this.getPageList();
          });
        }).catch(() => {
        });
      }
    },
    mounted() {
      this.resetFilterInput();
      this.getPageList();
    }
  }
</script>

<style lang="scss" scoped rel="stylesheet/scss" type="text/css">
    .order-expand-column {
        p {
            line-height: 20px;
            margin: 0;
            &:first-child:first-letter {
                letter-spacing: 28px;
            }
        }
        padding: 10px 0px;
    }
</style>