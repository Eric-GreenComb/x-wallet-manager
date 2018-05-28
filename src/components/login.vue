<template>
  <div class="container" style="background: #eee;height: 100%;">
    <div class="main" style="background: #EEEEEE;">
      <div class="con_width">
        <div class="main_con" style="padding: 40px;padding-right: 80px;width: 460px;margin: 5% auto;">
          <h1 class="login_header" style="color: #00A99D;font-weight: normal;"> 欢&nbsp;&nbsp;迎&nbsp;&nbsp;登&nbsp;&nbsp;陆</h1>
          <h1 class="login_header" style="color: #00A99D;font-weight: normal;"> Wallet 后&nbsp;台&nbsp;管&nbsp;理</h1>
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm login-form">
            <el-form-item label="管理员" prop="userID">
              <el-input v-model="ruleForm2.userID"></el-input>
            </el-form-item>
            <el-form-item label="密    码" prop="passwd">
              <el-input type="password" v-model="ruleForm2.passwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="submitForm('ruleForm2')" v-if="!isLoading">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
               <p><span class="register" @click="toRegister">创建管理员</span></p>
              <el-button type="primary" style="width: 100%;" v-if="isLoading" :loading="isLoading" >加载中</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {systemLogin} from '../api/index'
export default {
  data () {
    var myreg = /^[1][3,5,6,7,8][0-9]{9}$/;//验证userID(手机号)是否合法
    var validateName = (rule, value, callback) => {
      if (!myreg.test(value)) {
        callback(new Error('请输入管理员账号'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员密码'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      ruleForm2: {
        userID: '',
        passwd: ''
      },
      rules2: {
        userID: [
          { validator: validateName, trigger: 'blur' }
        ],
        passwd: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    var _this = this
    document.onkeydown = function (e) {
      if (e.key == 'Enter') {
        _this.submitForm('ruleForm2')
      }
    }
  },
  methods: {
    submitForm (formName) {
      var _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          systemLogin(_this.ruleForm2).then(function (res) {
            _this.isLoading = false
            //alert(res.data.errcode)
            if (res.data.errcode == 0) {
              //用token信息判断是否登陆成功
              _this.$message({
                message: '登录成功',
                type: 'success'
              })
              //登录成功后存储用户信息
              localStorage.setItem('token', res.data.token); //用的token
              localStorage.setItem('userID', _this.ruleForm2.userID);  //用户的ID
              _this.$router.push('/userList')  // 跳转到用户列表 userList
            }else if(res.data.errcode == 1){
              _this.$message({
                message: '用户名或密码错误',
                type: 'warning'
              })
              this.ruleForm2.userID = ''
              this.ruleForm2.pasaswd = ''
            }
          }).catch(function (res) {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toRegister(){
      this.$router.push({
        path: '/register', //后台管理员注册    暂未开放
      })
    }
  }
}
</script>

<style scoped>
  @import "../style/my.css";
  header{
    background: #fff;
  }
  .register{
    cursor: pointer;
    font-size: 0.7rem;
    color: #007aff;
    margin-left: 4.5rem;
    /*margin-left:7.3rem;*/
  }
</style>
