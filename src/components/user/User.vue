<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.username" placeholder="姓名"></el-input>
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
            <el-table-column prop="eid" label="ID" width="150"></el-table-column>
            <el-table-column prop="username" label="管理员" width="150"></el-table-column>
            <el-table-column prop="level" label="级别" width="150"></el-table-column>
            <el-table-column prop="type" label="类型" width="150"></el-table-column>
            <el-table-column prop="remarks" label="备注" min-width="150"></el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="doDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="page.ps"
                           :total="page.total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="editForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="addForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
  import {DEFAULT_PAGE_SIZE} from 'assets/js/constants'
  import NProgress from 'nprogress'
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
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          username: '',
          password: ''
        },

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          username: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
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
        getUserPage(params).then(({err,data,msg}) => {
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
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          username: '',
          sex: -1,
          age: 0,
          birth: '',
          addr: ''
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              NProgress.start();
              let params = Object.assign({}, this.editForm);
              params.birth = (!params.birth || params.birth == '') ? '' : util.formatDate.format(new Date(params.birth), 'yyyy-MM-dd');
              editUser(params).then(({err,data,msg}) => {
                this.editLoading = false;
                NProgress.done();
                this.$notify({title: '成功', message: '删除成功', type: 'success'});
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getPageList();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              NProgress.start();
              let params = Object.assign({}, this.addForm);
              params.birth = (!params.birth || params.birth == '') ? '' : util.formatDate.format(new Date(params.birth), 'yyyy-MM-dd');
              addUser(params).then(({err,data,msg}) => {
                this.addLoading = false;
                NProgress.done();
                this.$notify({title: '成功', message: '删除成功', type: 'success'});
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
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
          deleteUser(row.eid).then(({err,data,msg}) => {
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
          deleteUsers(userIds).then(({err,data,msg}) => {
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