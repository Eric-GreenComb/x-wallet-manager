<template>
  <div>
    <common-header :title="'商学院'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="标 题" prop="title" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
            <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="简 介" prop="dis" :rules="[{ required: true, message: '请输入简介', trigger: 'blur' }]">
            <el-input v-model="ruleForm.dis" placeholder="请输入简介" clearable></el-input>
          </el-form-item>
          <el-form-item label="类 型" prop="tag_id" :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
            <el-select v-model="tag_id" clearable placeholder="请选择类型"  @change="selectRank($event)">
              <el-option v-for="item in options"
                :key ='item.id'
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作 者" prop="author" :rules="[{ required: true, message: '请输入作者', trigger: 'blur' }]">
            <el-input v-model="ruleForm.author" placeholder="请输入作者" clearable></el-input>
          </el-form-item>
          <el-form-item label="封面图片（690*320）" prop="pic" :rules="[{ required: true, message: '请选择封面图', trigger: 'change' }]">
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
          <el-form-item label="视频 / 音频" prop="video">
            <div style="text-align: left;margin: 0px 0 10px;margin-left: 5%;">
              <label for="file" class="filecss"><i class="el-icon-upload el-icon--right" style="color: #fff;margin-right: 5px;"></i>导入视频/音频</label>
              <span>{{videoName}}</span>
              <input type="file" id="file" name="file"  @change="tirggerFile($event)" style="display: none;"/>
              <el-input style="height: 35px;width: 50%;" :disabled="true" v-model="videoName" class="inputHidden"></el-input>
              <div style="text-align: left;">
                <video id="video2" class="video-js vjs-default-skin vjs-big-play-centered" style="width: 300px;" controls :src="videoPath">
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
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
import {getCollegeClassfy, addCollegeMaterial, getCollegeMaterialDetail, uploadMaterialsPic, uploadVedio} from '../../api/index'
export default {
  components: {
    editor: Editor,
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    var contentNr = (rule, value) => {
      if (value === '') {
        callback(new Error('请输入内容'));
      }
    }
    return {
      videoName: '',
      videoPath: '',
      time: '',
      src: '',
      isShowTrue: true,
      date_time: '',
      pic: '',
      file: '',
      picArr: [],
      tag_id: '',
      options: [],
      ruleForm: {
        token: '',
        id: '',
        type: 'material',
        title: '',
        dis: '',
        author: '',
        tag_id: '',
        tag_name: '',
        content: '',
        video: '',
        pic: '',
        pic_time: ''
      },
      content: '',
      type: 'register',
      rules: {
        content: [
          { validator: contentNr, trigger: 'blur' }
        ]
      }
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
    this.getorgan()
  },
  methods: {
    /*导入视频*/
    tirggerFile (event){
      var file = event.target.files[0];
      console.log('file',file)
      var param = new FormData(); //创建form对象
      param.append('uploadfile',event.target.files[0]);//通过append向form对象添加数据
      param.append('type','material_vedio');//添加form表单中其他数据
      console.log('type',file.type)
      if (file.type != 'video/mp4' && file.type != 'audio/mp3'){
        this.$message({
          type: 'warning',
          message: '请选择视频文件或音频文件'
        })
        return
      }

      this.videoName =file.name;
      var url = URL.createObjectURL(file);
      console.log('param',param)
      var _this = this;
      this.videoPath = url;
      setTimeout(function(){
        var videoPlayer2 = document.getElementById('video2');
        _this.time = videoPlayer2.duration;  //电影总时长
        if(_this.time>0){
          _this.$message({
            message: '导入成功',
            type: 'success'
          });
          var _this2 = _this;
          uploadVedio(param).then(function (res) {
            console.log('all',res.data.data)

            _this2.ruleForm.video = res.data.data.vedio_name
//            _this2.videoPath = res.data.data.vedio_url

          }).catch(function (err) {
            console.log(err)
          })

        }else{
          _this.$message({
            message: '导入失败，请转成H264编码的视频编码格式哦',
            type: 'warning'
          });

        }
      },1000);
    },
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
      formData.append('type', 'material_pic');
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
      getCollegeMaterialDetail({ 'id': this.ruleForm.id }).then(function (res) {
        _this.ruleForm.content = res.data.data.content
        _this.content = res.data.data.content
        _this.ruleForm.title = res.data.data.title
        _this.ruleForm.dis = res.data.data.dis
        _this.ruleForm.author = res.data.data.author
        _this.tag_id = res.data.data.tag_id
        _this.ruleForm.tag_id = res.data.data.tag_id
        _this.ruleForm.tag_name = res.data.data.tag_name
        _this.ruleForm.pic_time = res.data.data.pic.pic_time
        _this.ruleForm.pic = res.data.data.pic.pic_name
        _this.src = res.data.data.pic.pic_url
        _this.videoPath = res.data.data.video.video_url
        _this.videoName = res.data.data.video.video_name
        _this.ruleForm.video = res.data.data.video.video_name

      }).catch(function (err) {
        console.log(err)
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.content = this.content
          var _this = this;
          console.log('this.ruleForm', this.ruleForm);
          addCollegeMaterial(this.ruleForm).then(function(res){
            if (res.data.errcode==0) {
              _this.$message({
                type: 'success',
                message: '保存成功!'
              });
              _this.$router.push('/Courseware')
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
        } else {
          console.log('error submit!!');
          return false;
        }
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
    height:160px;
    line-height:160px;
  }


</style>
