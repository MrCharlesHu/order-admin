<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.username" placeholder="管理员"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPageList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="page.items" highlight-current-row v-loading="loading" style="width: 100%;">
            <el-table-column prop="eid" label="ID" min-width="120"></el-table-column>
            <el-table-column prop="username" label="管理员" min-width="120"></el-table-column>
            <el-table-column prop="level" label="级别" min-width="120"></el-table-column>
            <el-table-column prop="type" label="类型" min-width="120"></el-table-column>
            <el-table-column prop="remarks" label="备注" min-width="120"></el-table-column>
            <el-table-column label="操作" min-width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="doDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar table-footer">
            <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="page.ps"
                           :total="page.total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addFormData" label-width="120px" :rules="addFormRules" ref="addFormData">
                <el-form-item label="用户名称" prop="addUsername">
                    <el-input type="text" v-model="addFormData.addUsername" auto-complete="off" placeholder="用户名称"/>
                </el-form-item>
                <el-form-item label="用户密码" prop="password">
                    <el-input type="password" v-model="addFormData.addPassword" auto-complete="off" placeholder="用户密码"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editFormData" label-width="120px" :rules="editFormRules" ref="editFormData">
                <el-form-item label="用户名称" prop="editUsername">
                    <el-input type="text" v-model="editFormData.editUsername" auto-complete="off" placeholder="用户名称"/>
                </el-form-item>
                <el-form-item label="用户密码" prop="editPassword">
                    <el-input type="password" v-model="editFormData.editPassword" auto-complete="off"
                              placeholder="用户密码"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import {DEFAULT_PAGE_SIZE} from 'assets/js/constants'
  import NProgress from 'nprogress'
  import MD5 from 'md5'
  import {getUserPage, deleteUser, deleteUsers, addUser, editUser} from 'api/api'

  export default {
    data() {
      return {
        filters: {
          username: ''
        },
        page: {
          total: 0,
          items: [],
          pn: 1,
          ps: DEFAULT_PAGE_SIZE
        },
        loading: false,
        selected: [],//列表选中列

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          addUsername: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          addPassword: [
            {required: true, message: '请输入用户密码', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addFormData: {
          addUsername: '',
          addPassword: ''
        },

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          editUsername: [
            {required: true, message: '请输入用户名称', trigger: 'blur'}
          ],
          editPassword: [
            {required: true, message: '请输入用户密码', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editFormData: {
          eid: 0,
          username: '',
          password: ''
        }
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.page.pn = val;
        this.getPageList();
      },
      //获取用户列表
      getPageList() {
        let params = {
          pn: this.page.pn,
          ps: this.page.ps,
          username: this.filters.username
        };
        this.loading = true;
        NProgress.start();
        getUserPage(params).then(({err, data, msg}) => {
          this.page.total = data.total;
          this.page.items = data.items;
          this.loading = false;
          NProgress.done();
        });
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addFormData.addUsername = '';
        this.addFormData.addPassword = '';
      },
      //新增
      addSubmit: function () {
        this.$refs.addFormData.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              NProgress.start();
              var params = {
                username: this.addFormData.addUsername,
                password: MD5(this.addFormData.addPassword)
              };
              addUser(params).then(({err, data, msg}) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({title: '成功', message: '删除成功', type: 'success'});
                this.$refs['addFormData'].resetFields();
                this.addFormVisible = false;
                this.getPageList();
              });
            });
          }
        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editFormData.eid = row.eid;
        this.editFormData.editUsername = row.username;
        this.editFormData.editPassword = '';
      },
      //编辑
      editSubmit: function () {
        this.$refs.editFormData.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              var params = {
                eid: this.editFormData.eid,
                username: this.editFormData.editUsername,
                password: MD5(this.editFormData.editPassword)
              };
              console.log(params);
              editUser(params).then(({err, data, msg}) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({title: '成功', message: '修改成功', type: 'success'});
                this.$refs['editFormData'].resetFields();
                this.editFormVisible = false;
                this.getPageList();
              });
            });
          }
        });
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
          deleteUser(row.eid).then(({err, data, msg}) => {
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
        var userIds = this.selected.map(item => item.eid).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          NProgress.start();
          deleteUsers(userIds).then(({err, data, msg}) => {
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
      this.getPageList();
    }
  }
</script>