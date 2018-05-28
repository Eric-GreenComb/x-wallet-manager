<template>
  <div>
    <common-header :title="'活动管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标 题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="封面图片（690*230）" prop="pic">
            <div style="width: 90%;text-align: left;margin-left: 5%;">
              <div v-show=" src==''" class="add-img img-box" @click="uploadInput()" v-if="isShowTrue">
                <i class="el-icon-picture-outline"></i>
              </div>
              <div class="img-box" @click="uploadInput()" v-show="src!=''" v-if="isShowTrue">
                <img :src="src" alt="" ref="img">
              </div>
              <input type="file" ref="file"  v-on:change="upload()" hidden v-if="isShowTrue">
            </div>
          </el-form-item>
          <el-form-item label="内 容" prop="content">
            <editor ref="myTextEditor" :fileName="'uploadfile'"  v-model="content" style="width: 90%;margin: 0 auto;text-align: left;"></editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">立即创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import Editor from '../common/editor.vue'
import {addActivity, getDetailActivity, uploadMaterialsPic} from '../../api/index'
export default {
  components: {
    editor: Editor,
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      src: '',
      isShowTrue: true,
      date_time: '',
      pic: '',
      file: '',
      picArr: [],
      tag_id: '',
      options: [],
      ruleForm: {
        id: '',
        title: '',
        pic: '',
        pic_time: '',
        content: '',
        token: ''
      },
      content: '',
      type: 'register',
    }
  },
  created () {
    var date = new Date()
    this.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    this.ruleForm.token = window.sessionStorage.getItem('session')
    this.ruleForm.id = this.$route.query.id
    this.title2 = this.$route.query.title
    if (this.ruleForm.id != 0) {
      this.getContent()
    }
  },
  methods: {
    uploadInput (){
      this.isShowTrue = true;
      this.$refs.file.click();
    },
    upload () {
      var _this = this;
      if (this.$refs.file.files.length == 0){
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(this.$refs.file.files[0]);
      reader.onload = function () {
        _this.src = this.result;
      };

      var formData = new FormData();
      formData.append('uploadfile', this.$refs.file.files[0]);
      formData.append('date_time', this.date_time);
      formData.append('type', 'activity');
      this.isShowTrue = false;
      uploadMaterialsPic(formData).then(function (res) {

        if(res.data.errcode==1){
          _this.$message({
            message: '上传图片失败，请重新上传',
            type: 'warning'
          });
          return false;
        } else {
          _this.ruleForm.pic = res.data.data.pic_name;
          _this.ruleForm.pic_time = res.data.data.date_time;
          _this.isShowTrue = true;
          return true;
        }
      }).catch(function (err) {
        console.log(err);
        _this.isShowTrue = true;
      })
    },
    getContent (id) {
      var _this = this
      getDetailActivity({ 'id': this.ruleForm.id }).then(function (res) {
        _this.ruleForm.content = res.data.data.content
        _this.content = res.data.data.content
        _this.ruleForm.title = res.data.data.title
        _this.tag_id = res.data.data.tag_id
        _this.ruleForm.pic_time = res.data.data.pic.pic_time
        _this.ruleForm.pic = res.data.data.pic.pic_name
        _this.src = res.data.data.pic.pic_url

      }).catch(function (err) {
        console.log(err)
      })
    },
    submitForm () {
      this.ruleForm.content = this.content
      var _this = this;
      if (this.ruleForm.title == ''){
        this.$message({
          type: 'warning',
          message: '请输入标题!'
        });
        return
      }
      if (this.ruleForm.pic == ''){
        this.$message({
          type: 'warning',
          message: '请选择封面图片!'
        });
        return
      }
      if (this.ruleForm.content == ''){
        this.$message({
          type: 'warning',
          message: '请输入内容!'
        });
        return
      }
      console.log('this.ruleForm', this.ruleForm)
      addActivity(this.ruleForm).then(function(res){
        if (res.data.errcode==0) {
          _this.$message({
            type: 'success',
            message: '保存成功!'
          })
          _this.$router.push('/activityList')
          window.close();
        } else {
          _this.$message({
            type: 'error',
            message: '保存失败!'
          })
        }
      }).catch(function (err) {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }
  .filecss{
    /*width: 100%;*/
    text-align: center;
    background: #409EFF;
    padding: 2px 10px 0px 4px;
    border-radius: 5px;
    display: inline-block;
    color: #fff;
    font-size: 12px;
    font-weight: normal;
    line-height: 29px;
  }
  .inputHidden{
    display: none;
  }
  .img-box{
    width:345px;
    max-width:345px;
    height:115px;
    line-height:155px;
  }


</style>
