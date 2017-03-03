<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.username" placeholder="管理员"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getPageList">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="page.items" highlight-current-row v-loading="loading" style="width: 100%;">
            <!--<el-table-column type="selection" width="35"></el-table-column>-->
            <!--<el-table-column type="index" width="35"></el-table-column>-->
            <el-table-column prop="eid" label="ID" width="100"></el-table-column>
            <el-table-column prop="username" label="管理员" width="120"></el-table-column>
            <el-table-column prop="action" label="级别" width="120"></el-table-column>
            <el-table-column prop="ip" label="IP" width="120"></el-table-column>
            <el-table-column prop="browser" label="IP信息" min-width="150"></el-table-column>
            <el-table-column prop="ctime" label="登录时间" width="200" :formatter="formatDateTime"></el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar table-footer">
            <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="page.ps"
                           :total="page.total" style="float:right;">
            </el-pagination>
        </el-col>
    </section>
</template>
<script>
  import {DEFAULT_PAGE_SIZE} from 'assets/js/constants'
  import DateUtils from 'assets/js/date_utils'
  import NProgress from 'nprogress'
  import {getLogPage} from 'api/api';

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
        loading: false
      }
    },
    methods: {
      formatDateTime: function (row, column) {
        return DateUtils.formatDateTime(row.ctime);
      },
      handleCurrentChange(val) {
        this.page.pn = val;
        this.getPageList();
      },
      //获取用户列表
      getPageList() {
        let params = {
          pn: this.page.pn,
          ps: this.page.ps,
          username: this.username
        };
        this.loading = true;
        NProgress.start();
        getLogPage(params).then(({err, data, msg}) => {
          this.page.total = data.total;
          this.page.items = data.items;
          this.loading = false;
          NProgress.done();
        });
      }
    },
    mounted() {
      this.getPageList();
    }
  }
</script>

<style scoped></style>