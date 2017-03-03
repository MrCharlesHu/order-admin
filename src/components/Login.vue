<template>
    <el-form :model="loginForm" :rules="loginRule" ref="loginForm" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">系统登录</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click.native.prevent="doLogin" :loading="loggingIn">登录
            </el-button>
            <!--<el-button @click.native.prevent="doReset">重置</el-button>-->
        </el-form-item>
    </el-form>
</template>

<script>
  import {userLogin} from 'api/api'
  import Storage from 'assets/js/storage'
  import UUID from 'uuid'
  import MD5 from 'md5'
  import NProgress from 'nprogress'

  export default {
    data() {
      return {
        loggingIn: false,
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRule: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      doReset: function () {
        this.$refs.loginForm.resetFields();
      },
      doLogin: function () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.loggingIn = true;
            NProgress.start();
            var loginParams = {
              uniqueId: Storage.getUniqueId(),
              username: this.loginForm.username,
              password: MD5(this.loginForm.password)
            };
            userLogin(loginParams).then(({err, data, msg}) => {
              this.loggingIn = false;
              NProgress.done();
              if (err) {
                this.$notify({title: '错误', message: msg, type: 'error'});
              } else {
                Storage.saveLoginInfo(data);
                this.$router.push({path: '/order/today'});
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>
<style lang="scss" scoped rel="stylesheet/scss" type="text/css">
    .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin-bottom: 20px;
        background-color: #F9FAFC;
        margin: 180px auto;
        border: 2px solid #8492A6;
        width: 350px;
        padding: 35px 35px 15px 35px;
        .title {
            margin: 0px auto 40px auto;
            text-align: center;
            color: #505458;
        }
        .remember {
            margin: 0px 0px 35px 0px;
        }
    }
</style>