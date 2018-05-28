<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="this.name+'_认证信息'"></common-header-tilte>
      <div class="all-content">
        <el-form label-position="right" label-width="100px" :model="row">
          <el-form-item label="证件名:">
            <el-input v-model="row.ic_name" readonly></el-input>
          </el-form-item>
          <el-form-item label="证件号:">
            <el-input v-model="row.ic_number" readonly></el-input>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input v-model="row.author_reson" readonly></el-input>
          </el-form-item>

          <el-form-item label="原证正面件照:" >
            <img :src="card_pic_or" alt="">
            <!-- 放大图片 -->
            <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
          </el-form-item>

          <el-form-item label="原证反面件照:" >
            <img :src="card_pic_sc" alt="" @click="clickImg($event)">
            <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
          </el-form-item>

          <el-form-item label="审核状态:" style="text-align: left;">
            <span v-show="row.is_author=='0'" class="card">未认证</span>
            <span v-show="row.is_author=='1'" class="card">认证过</span>
            <span v-show="row.is_author=='2'" class="card">认证中</span>
            <span v-show="row.is_author=='3'" class="card">认证失败</span>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="refuse()" class="nopass" >审核不通过</el-button>
            <el-button type="primary"  @click="agree()" >审核通过</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getUserAuthorInfo, userAuthor} from '../../api/index'
import BigImg from '../common/bigImg.vue'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2,
    'big-img':BigImg
  },
  data () {
    return {
      showImg: false,
      imgSrc: '',
      row: {},
      name: '',
      card_pic_or: '',
      card_pic_sc: '',
      params: {
        user_id: ''
      },
      authorParams: {
        user_id: '',
        is_pass: '',
        desc: '',
        token: ''
      }
    }
  },
  created () {
    this.params.user_id = this.$route.query.id
    this.name = this.$route.query.name
    this.authorParams.user_id = this.$route.query.id
    this.authorParams.token = window.sessionStorage.getItem('session')
    this.getData()
  },
  methods: {
    getData () {
      var _this = this;
      getUserAuthorInfo(this.params).then(function (res) {
        _this.row = res.data.data
        _this.card_pic_or = _this.row.card_pic_or.url
        _this.card_pic_sc = _this.row.card_pic_sc.url
        console.log('_this.row.card_pic_sc',_this.row.card_pic_sc.url)
        /*_this.src = res.data.data.card_pic_or.url
        _this.src2 = res.data.data.card_pic_sc.url*/
      }).catch(function (err) {
        console.log(err);
      })
    },
    refuse(){
      var _this=this;
      this.$prompt('请输入驳回原因', '审核不通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'非必填'
      }).then(({ value }) => {
        _this.authorParams.is_pass = 'n';
        _this.authorParams.desc = value;
        userAuthor(_this.authorParams).then(function (res) {
          if(res.data.errcode==0){
            _this.$message({
              type: 'success',
              message: '提交成功'
            });
          }else{
            _this.$message({
              type: 'error',
              message: '提交失败'
            });
          }
        }).catch(function (err) {
          console.log(err);
        })
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '取消输入'
        });
      });

    },
    agree(){
      var _this=this;
      this.authorParams.is_pass = 'y'
      userAuthor(this.authorParams).then(function (res) {
        if(res.data.errcode==0){
          _this.$message({
            type: 'success',
            message: '提交成功'
          });
        }else{
          _this.$message({
            type: 'error',
            message: '提交失败'
          });
        }
      }).catch(function (err) {
        console.log(err);
      })

    },
    clickImg(e) {
      this.showImg = true;
      // 获取当前图片地址
      this.imgSrc = e.currentTarget.src;
    },
    viewImg(){
      this.showImg = false;
    }
  }
}
</script>
<style scoped="">
</style>
