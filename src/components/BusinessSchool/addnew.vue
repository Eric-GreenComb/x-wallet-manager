<template>
  <div>
    <common-header :title="'商学院'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标 题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="简 介" prop="dis">
            <el-input v-model="ruleForm.dis" placeholder="请输入简介" clearable></el-input>
          </el-form-item>
          <el-form-item label="类 型" prop="tag_id">
            <el-select v-model="tag_id" clearable placeholder="请选择类型"  @change="selectRank($event)">
              <el-option
                v-for="item in options"
                :key ='item.id'
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作 者" prop="author">
            <el-input v-model="ruleForm.author" placeholder="请输入作者" clearable></el-input>
          </el-form-item>
          <el-form-item label="内 容" prop="content">
            <editor ref="myTextEditor" :fileName="'uploadfile'"  v-model="content" style="width: 90%;margin: 0 auto;text-align: left;"></editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
import {getCollegeClassfy, addCollegeMaterial, getCollegeMaterialDetail} from '../../api/index'
export default {
  components: {
    editor: Editor,
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      tag_id: '',
      options: [],
      ruleForm: {
        token: '',
        id: '',
        type: 'article',
        title: '',
        dis: '',
        author: '',
        tag_id: '',
        tag_name: '',
        content: '',
        video: '',
        pic: '',
        pic_time: '',
      },
      content: '',
      type: 'register'
    }
  },
  created () {
    this.ruleForm.token = window.sessionStorage.getItem('session')
    this.ruleForm.id = this.$route.query.id
    this.title2 = this.$route.query.title
    if (this.ruleForm.id != 0) {
      this.getContent()
    }
    this.getorgan()
  },
  methods: {
    selectRank (val) {
      this.ruleForm.tag_id = val
      for (var i = 0; i < this.options.length; i++) {
        if (val == this.options[i].id) {
          this.ruleForm.tag_name = this.options[i].name
        }
      }
    },
    getorgan () {
      var _this = this
      getCollegeClassfy({type: 'all'}).then(function (res) {
        console.log('all',res.data.data)
        for (var i = 0; i < res.data.data.length; i++) {
          var obj = {
            name: res.data.data[i].name,
            id: res.data.data[i].id
          }
          _this.options.push(obj)
        }
      }).catch(function (err) {
        console.log(err)
      })
    },
    getContent (id) {
      var _this = this
      var getpic_name = ''
      var getpic_url = ''
      this.fileListPic = []
      this.picArr = []
      getCollegeMaterialDetail({ 'id': this.ruleForm.id }).then(function (res) {
        _this.ruleForm.content = res.data.data.content
        _this.content = res.data.data.content
        _this.ruleForm.title = res.data.data.title
        _this.ruleForm.dis = res.data.data.dis
        _this.ruleForm.author = res.data.data.author
        _this.tag_id = res.data.data.tag_id
        _this.ruleForm.tag_id = res.data.data.tag_id
        _this.ruleForm.tag_name = res.data.data.tag_name
//        _this.ruleForm.pic_times = res.data.data.pic_times

        /*for (var i = 0; i < res.data.data.pics.length; i++) {
          var obj = {
            name: res.data.data.pics[i].pic_name,
            url: res.data.data.pics[i].pic_url
          }
          _this.fileListPic.push(obj)  // 展示在页面上
          getpic_name += res.data.data.pics[i].pic_name + ','
          getpic_url += res.data.data.pics[i].pic_url + ','
        }*/

        /*var obj2 = {
          date_time: res.data.data.pic_times,
          pic_name: getpic_name.substring(0,getpic_name.length-1),
          pic_url: getpic_url
        }
        _this.picArr.push(obj2) // 后台得到的图片数组
        console.log('dss',_this.picArr)*/
      }).catch(function (err) {
        console.log(err)
      })
    },
    submitForm () {
      this.ruleForm.content = this.content
      /*this.ruleForm.pic_times = ''
      this.ruleForm.pics = ''
      var pic_times = ''
      var pics = ''
      console.log('picArr',this.picArr);
      for (var i = 0; i < this.picArr.length; i++) {
        pic_times += this.picArr[i].date_time + ','
        pics += this.picArr[i].pic_name + ','
      }
      this.ruleForm.pic_times = pic_times.substring(0,pic_times.length-1)
      this.ruleForm.pics = pics.substring(0,pics.length-1)*/
      if (this.ruleForm.title == '') {
        this.$message({
          message: '请输入标题',
          type: 'warning'
        })
        return false
      }
      if (this.ruleForm.dis == '') {
        this.$message({
          message: '请输入简介',
          type: 'warning'
        })
        return false
      }
      if (this.ruleForm.tag_id == '') {
        this.$message({
          message: '请选择类型',
          type: 'warning'
        })
        return false
      }
      if (this.ruleForm.author == '') {
        this.$message({
          message: '请输入作者',
          type: 'warning'
        })
        return false
      }
      /*if (this.picArr == '') {
        this.$message({
          message: '请选择图片',
          type: 'warning'
        })
        return false
      }*/
      if (this.ruleForm.content == '') {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
        return false
      }
      var _this = this;
      console.log('this.ruleForm',this.ruleForm);
      addCollegeMaterial(this.ruleForm).then(function(res){
        if(res.data.errcode==0){
          _this.$message({
            type: 'success',
            message: '保存成功!'
          });
          _this.$router.push('/Analects')
          window.close();
        }else{
          _this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
      }).catch(function (err) {
        console.log(err);
      })
    }
  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }


</style>
