<template>
  <div>
    <common-header :title="'商品管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'素材管理_'+goods_name"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <!--<el-button type="primary" class="search-btn" @click="add()">添加素材</el-button>-->
        <el-button type="primary" class="search-btn" @click="edit()">编辑素材</el-button>
      </div>
      <div style="margin-top: 10px;">
        <div style="text-align: left;margin-bottom: 6px;"><h4 style="margin-bottom: 10px;">描述：</h4><p>{{share_text}}</p></div>
        <ul class="imgsbox clearfix">
          <li v-for="item in items"><img :src="item.pic_url" alt=""></li>
        </ul>
        <!--编辑-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
          <el-form :model="ruleForm" ref="ruleForm" label-width="0px" class="demo-ruleForm">
          <el-form-item>
            <el-input style="margin-bottom: 20px;"
              type="textarea"
              :rows="2"
              v-model="ruleForm.share_text"
              placeholder="请输入描述">
            </el-input>
            <el-upload style="width: 100%;text-align: left;"
                       :action= "actionUrl"
                       v-model="ruleForm.pics"
                       list-type="picture-card"
                       name="uploadfile"
                       :data= "upLoadData"
                       :file-list= "fileListPic"
                       :on-success="successMessage"
                       :on-preview="handlePictureCardPreview"
                       :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <!--<el-form-item>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="save()">立即创建</el-button>
          </el-form-item>-->
        </el-form>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="save()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>

import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import config from '../../api/config' // 引入config文件里，图片上传的方法第一步
import {updateGoodsMaterials, getGoodsMaterials} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      share_text: '', // 文案描述
      ParentPage: '', // 接收上一页传过来的当前页数，以便返回时，还是当前页
      items: '',
      actionUrl: '',
      goods_name: '',
      upLoadData: {
        date_time: '',
        type: 'poster'
      },
      fileListPic: [],
      picArr: [],
      ruleForm: {
        share_text: '',
        goods_id: '',
        pics: '',
        pic_times: '',
        token: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      parentGoodsId: '',
      dialogTitle: '',
      dialogFormVisible: false
    }
  },
  mounted () {
    this.actionUrl = config.uploadMaterialsPic // 引入config文件里，图片上传的方法第二步
  },
  created () {
    this.ParentPage = this.$route.query.thisPage //接收父页面传过来的页数
    var date = new Date()
    this.upLoadData.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    this.parentGoodsId = this.$route.query.id
    this.goods_name = this.$route.query.goods_name
    this.ruleForm.token = window.sessionStorage.getItem('session')
    this.getContent()
  },
  methods: {
    handleRemove (file, fileList) {
      console.log('fileListdel',fileList)
      this.picArr = [];
      for (var i = 0; i < fileList.length; i++) {
        console.log('i',fileList[i])
        if ('response' in fileList[i]) {
          this.picArr.push(fileList[i].response.data)
        } else {
          var obj = {
            date_time: fileList[i].time,
            pic_name: fileList[i].name,
            pic_url: fileList[i].url
          }
          this.picArr.push(obj)
        }
      }
      console.log('del',this.picArr)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    successMessage (file,fileList) {
      var obj = fileList.response.data
      this.picArr.push(obj)
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.log('file',file);
    },
    edit () {
      this.dialogTitle = '编辑素材'
      this.dialogFormVisible = true
      this.ruleForm.goods_id = this.parentGoodsId
    },
    getContent () {
      var _this = this
      var getpic_name = ''
      var getpic_url = ''
      var getpic_time = ''
      this.items = []
      this.fileListPic = []
      this.picArr = []
      getGoodsMaterials({ 'goods_id': this.parentGoodsId }).then(function (res) {
        console.log('res',res.data.data)
        if (res.data.data.pics.length>0) {
          _this.items = res.data.data.pics
          _this.share_text = res.data.data.share_text
          _this.ruleForm.share_text = res.data.data.share_text

          for (var i = 0; i < res.data.data.pics.length; i++) {
            var obj = {
              name: res.data.data.pics[i].pic_name,
              url: res.data.data.pics[i].pic_url,
              time: res.data.data.pics[i].pic_time
            }
            if(obj.name!=''){
              _this.fileListPic.push(obj) // 展示在页面上
              getpic_name += res.data.data.pics[i].pic_name + ','
              getpic_url += res.data.data.pics[i].pic_url + ','
              getpic_time += res.data.data.pics[i].pic_time + ','
            }
          }
          console.log('fileListPic',_this.fileListPic)

          var obj2 = {
            date_time: getpic_time.substring(0,getpic_time.length-1),
            pic_name: getpic_name.substring(0,getpic_name.length-1),
            pic_url: getpic_url
          }
          _this.picArr.push(obj2) // 后台得到的图片数组
        }
        console.log('dss',_this.picArr)
      }).catch(function (err) {
        console.log(err)
      })
    },
    save () {
      this.ruleForm.pic_times = ''
      this.ruleForm.pics = ''
      var pic_times = ''
      var pics = ''
      console.log('picArr',this.picArr);
      for (var i = 0; i < this.picArr.length; i++) {
        pic_times += this.picArr[i].date_time + ','
        pics += this.picArr[i].pic_name + ','
      }
      this.ruleForm.pic_times = pic_times.substring(0,pic_times.length-1)
      this.ruleForm.pics = pics.substring(0,pics.length-1)
      /*if (this.picArr == '') {
        this.$message({
          message: '请选择图片',
          type: 'warning'
        })
        return false
      }*/

      if (this.ruleForm.share_text == ''){
        this.$message({
          message: '请输入描述',
          type: 'warning'
        })
        return false
      }
      var _this = this;
      console.log('this.ruleForm',this.ruleForm);
      updateGoodsMaterials(this.ruleForm).then(function(res){
        if (res.data.errcode==0){
          _this.$message({
            type: 'success',
            message: '提交成功!'
          })
          _this.getContent()
          _this.dialogFormVisible = false

        } else {
          _this.$message({
            type: 'error',
            message: '提交失败!'
          })
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .imgsbox li{
    list-style-type: none;
    width:25%;
    float: left;
    text-align: left;
  }
  .imgsbox li img{
    width:90%;
  }

</style>
