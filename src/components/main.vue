<template>
  <div class="container" style="height: 100%;">
    <el-header>
      <div class="con_width clearfix">
        <div class="container_left" style="cursor:pointer" @click="loginBtn()"><img src="../assets/logo.png" alt="" style="height: 33px;float: left;margin-right:10px;margin-top: 10px;"><span style="float: left;">Wallet&nbsp;后台管理系统</span></div>
        <div class="" style="float: right;">
          <el-col class="self-col">
            <el-dropdown class="administrator">
              <span class="adminName">您好，{{mobile}}</span>
              <img src="../assets/user.png" alt="" style="float: right;margin-top:4%;margin-left: 7px;">
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="loginOut()" class="loginout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </div>
      </div>
    </el-header>

    <el-container style="height: 92.3%;">
      <el-aside width="200px">
        <div style="">
          <el-menu :default-active="key" class="el-menu-vertical-demo"  :router="true" background-color="#274a61" :unique-opened="true" @select="handleSelect"  text-color="#fff" active-text-color="#fff">
            <el-submenu index="1">
              <template slot="title"><i class="icon iconfont icon-yonghuguanli icon_menu"></i><span>用户管理</span></template>
              <el-menu-item index="/userList" >用户列表</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title"><i class="icon iconfont icon-shangpinguanli icon_menu"></i><span>积分管理</span></template>
              <!--<el-menu-item index="/ShopkeeperBag">店长礼包</el-menu-item>
              <el-menu-item index="/groupBuying">团购</el-menu-item>
              <el-menu-item index="/rushBuying">抢购</el-menu-item>-->
              <el-menu-item index="/goodsList">积分列表</el-menu-item>
              <!--<el-menu-item index="/classfiyMessage">分类管理</el-menu-item>-->
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="icon iconfont icon-gengduotupian icon_menu" style="font-size: 18px;"></i><span>数据统计</span></template>
              <el-menu-item index="/bannerList">用户积分一览表</el-menu-item>
            </el-submenu>
          <!--  <el-submenu index="4">
              <template slot="title"><i class="icon iconfont icon-dingdanguanli icon_menu"></i><span>订单管理</span></template>
              <el-menu-item index="/orderList">订单列表</el-menu-item>
            </el-submenu>-->
            <!--<el-submenu index="5">
              <template slot="title"><i class="icon iconfont icon-tangxueyuan icon_menu"></i><span>商学院</span></template>
              <el-menu-item index="/Analects">论语</el-menu-item>
              <el-menu-item index="/Courseware">课件</el-menu-item>
              <el-menu-item index="/classification">分类</el-menu-item>
            </el-submenu>-->
            <!--<el-submenu index="6">
              <template slot="title"><i class="icon iconfont icon-faxian icon_menu" style="font-size: 17px;"></i><span>发现</span></template>
              <el-menu-item index="/find">发现列表</el-menu-item>
            </el-submenu>-->
           <!-- <el-submenu index="7">
              <template slot="title"><i class="icon iconfont icon-tixian icon_menu"></i><span>提现管理</span></template>
              <el-menu-item index="/widthdrawCash">提现列表</el-menu-item>
            </el-submenu>-->
            <!--<el-submenu index="8">
              <template slot="title"><i class="icon iconfont icon-xiaoxiguanli icon_menu"></i><span>消息管理</span></template>
              <el-menu-item index="/news">消息列表</el-menu-item>
            </el-submenu>-->
            <!--<el-submenu index="9">
              <template slot="title"><i class="icon iconfont icon-huodongguanli1 icon_menu"></i><span>活动管理</span></template>
              <el-menu-item index="/activityList">活动列表</el-menu-item>
            </el-submenu>-->
            <el-submenu index="10">
              <template slot="title"><i class="el-icon-setting" style="font-size: 17px;"></i><span>系统管理</span></template>
              <!--<el-menu-item index="/getVoucherList_score">积分兑换抵用券</el-menu-item>
              <el-menu-item index="/getVoucherList">系统赠送抵用券</el-menu-item>
              <el-menu-item index="/KF">常见问题</el-menu-item>-->
              <el-menu-item index="/GVRP">修改管理员密码</el-menu-item>
              <el-menu-item index="/hotWords" @click="loginOut()">退出</el-menu-item>
            <!-- <el-menu-item index="/power_set">权限管理</el-menu-item>
              <el-menu-item index="/MallParams">商城参数配置</el-menu-item>-->
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main style="background: #EEEEEE;">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// import {logout} from '../api/index';

export default {
  data () {
    return {
      key: '/goodsList',
      mobile: '',
      user: '',
      user_type: '',
      dialogTitle: '',
      successMsg: '',
      errorMsg: ''
    }
  },
  mounted () {
    this.key = window.sessionStorage.getItem('keyPath')
  },
  created () {
    this.mobile = localStorage.getItem('userID') //从本地村中取出userID
  },
  methods: {
    handleSelect (key, keyPath) {
      this.key = keyPath[1]
      window.sessionStorage.setItem('keyPath', keyPath[1])
    },
    loginBtn () {
      this.$router.push('/goodsList')
      window.sessionStorage.setItem('keyPath', '/goodsList')
      this.key = '/goodsList'
    },
    loginOut () {
       var _this = this
      this.$confirm('您确定要退出吗?', '退出管理平台', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // logout().then(function (res) {
        //   if (res.data.errcode == '0') {
        //     _this.$message({
        //       message: res.data.errdesc,
        //       type: 'success'
        //     })
             _this.$router.push('/')
             window.localStorage.clear()
             window.sessionStorage.clear()
        //   } else {
        //     _this.$message({
        //       message: res.data.errdesc,
        //       type: 'warning'
        //     })
        //   }
        // }).catch(function (err) {
        // })
      }).catch(() => {

      })
    }
  }
}
</script>

<style scoped>
  /*@import "../assets/icon/iconfont.css";*/
  .el-submenu .el-menu{
    overflow: hidden;
    background: #fff!important;
  }
  .el-menu{
    border-right:transparent;
  }

  .el-menu li{
    text-align: left;
  }
  .el-submenu__title * {
    font-size: 15px;
  }
  .el-submenu .el-menu-item {
    font-size: 15px;
  }
  .el-menu-item {
    font-size: 15px;
  }
  .el-submenu__title {
    font-size: 15px;
  }
  header h4{
    margin-top:7px;
    display: inline-block;
  }
  .logo{
    width:65px;
    vertical-align: middle;
    margin-right:10px;
  }
  .redlogo {
    font-size:30px;
    color: #fff;
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 3px;
    display: inline-block;
  }
  .content{
    overflow: scroll;
  }

  .redlogo{
    float: right;
    margin:0;
  }
  .username{
    float: left;
    color: rgb(255, 255, 255);
    display: inline-block;
    height: 33px;
    line-height: 33px;
    font-size: 16px;
    margin-right: 10px;
  }
  .el-submenu__title i{
    /*color: #fff;*/
    font-size: 16px;
  }

  i.el-submenu__icon-arrow{
    color: #fff;
    font-size: 16px;
  }
  .el-button--success{
    background: #01A89E;
    border:1px solid #01A89E;
  }
  .el-button--success:hover{
    background: #41c5bd;
    border:1px solid #41c5bd;
  }
  .el-button--danger{
    background: #FF6A7C;
  }
  .el-button--danger:hover{
    background: #F97F8E;
  }
  .impot-btn{
    margin-top:50px;
    text-align: right;
  }
  .el-table thead tr  {
    background: #EDEEF2;
  }

  .el-range-editor.el-input__inner{
    width:390px!important;
  }

  .el-submenu__title i{
    color:#fff !important;
  }

  .el-menu-item i{
    color: #ffffff !important;
  }
  .el-menu.el-menu-vertical-demo .el-submenu .el-menu-item .el-submenu__icon-arrow, .el-menu.el-menu-vertical-demo .el-submenu__title {
    color: #fff!important;
  }
  .el-icon-arrow-down:before {
    content: "\271A"!important;
    color: #FFF!important;
    font-size:16px!important;
  }
  .el-menu-item{
    color: #b5b4c2 !important;
  }
  .el-menu-item.is-active{
    background: #28333E!important;
  }
</style>
