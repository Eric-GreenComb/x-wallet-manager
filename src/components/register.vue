<template>
  <div class="container" style="background: #eee;height: 100%;">
    <div class="main" style="background: #EEEEEE;">
      <div class="con_width">
        <div class="main_con" style="padding: 40px;padding-right: 80px;width: 460px;margin: 5% auto;">
          <h1 class="login_header" style="color: #00A99D;font-weight: normal;"> Wallet 后台管理</h1>
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm login-form">
            <el-form-item label="手机号" prop="userID">
              <el-input v-model="ruleForm2.userID"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passwd">
              <el-input type="password" v-model="ruleForm2.passwd" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="name">
              <el-input type="text" v-model="ruleForm2.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="email" v-model="ruleForm2.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="submitForm('ruleForm2')" v-if="!isLoading">创&nbsp;&nbsp;建&nbsp;&nbsp;用&nbsp;&nbsp;户</el-button>
              <el-button type="primary" style="width: 100%;" v-if="isLoading" :loading="isLoading" >加载中</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {createUser} from '../api/index'

export default {
  data () {
    var myreg = /^[1][3,5,6,7,8][0-9]{9}$/;//验证userID(手机号)是否合法
    var emreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/; //邮箱验证
    var passreg = /^[a-zA-Z0-9]*([a-zA-Z][0-9]|[0-9][a-zA-Z])[a-zA-Z0-9]*$/; //密码验证   字母+数字 的格式
    //验证手机号格式
    var validateName = (rule, value, callback) => {
      if ( !myreg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    //验证密码的长度
    var validatePass2 = (rule, value, callback) => {
      if (!passreg.test(value)) {
        callback(new Error('密码为字母+数字,6--20位'))
      } else {
        callback()
      }
    }
    //验证昵称是否为空
    var validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else {
        callback()
      }
    }
    //验证邮箱格式是否正确
    var validatePass4 = (rule, value, callback) => {
      if (!emreg.test(value)) {
        callback(new Error('请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      ruleForm2: {
        userID: '',
        passwd: '',
        name:'',
        email:''
      },
      rules2: {
        userID: [
          { validator: validateName, trigger: 'blur' }
        ],
        passwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        name: [
          { validator: validatePass3, trigger: 'blur' }
        ],
        email: [
          { validator: validatePass4, trigger: 'blur' }
        ],
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
          createUser(_this.ruleForm2).then(function (res) {
            _this.isLoading = false
            if (res.data.errcode == 0) {
              //用token信息判断是否登陆成功
              _this.$message({
                message: '创建成功',
                type: 'success'
              })
              _this.$router.push('/userList')
            } else {
              _this.$message({
                message: '创建失败',
                type: 'warning'
              })
              this.ruleForm2.userID = ''
              this.ruleForm2.pasaswd = ''
              this.ruleForm2.name = ''
              this.ruleForm2.email = ''
            }
          }).catch(function (res) {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
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
    font-size: 0.8rem;
    color: #0bb20c;
    margin-left: 7.3rem;
  }
</style>
