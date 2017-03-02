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
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="page.ps"
                           :total="page.total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
  import Constants from 'assets/js/constants'
  import {getUserList} from 'api/api';
  import NProgress from 'nprogress'
  
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
          ps: Constants.DefaultPageSize
        },
        loading: false
      }
    },
    methods: {
      //性别显示转换
      formatSex: function (row, column) {
        return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page.pn = val;
        this.getPageList();
      },
      //获取用户列表
      getPageList: function () {
        let params = {
          pn: this.page.pn,
          ps: this.page.ps,
          username: this.filters.username
        };
        this.loading = true;
        NProgress.start();
        getUserList(params).then((res) => {
          this.page.total = res.data.data.total;
          this.page.items = res.data.data.items;
          this.loading = false;
          NProgress.done();
        });
      }
    },
    mounted() {
      this.getPageList();
    }
  };
</script>
<style scoped></style>