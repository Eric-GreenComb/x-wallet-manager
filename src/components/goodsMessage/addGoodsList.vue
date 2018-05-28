<template>
  <div>
    <common-header :title="'积分管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="title2"></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="手机号">
            <el-input v-model="ruleForm.userID" placeholder="请输入用户手机号" clearable maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密    码">
            <el-input v-model="ruleForm.pwd" placeholder="请输入用户密码" clearable ></el-input>
          </el-form-item>
          <el-form-item label="昵    称">
            <el-input v-model="ruleForm.name" placeholder="请输入用户昵称" clearable></el-input>
          </el-form-item>
          <el-form-item label="标    识">
            <el-input v-model="ruleForm.symbol" placeholder="请输入积分标识" clearable></el-input>
          </el-form-item>
          <el-form-item label="发布数量">
            <el-input v-model="ruleForm.total" placeholder="请输入发布数量" clearable></el-input>
          </el-form-item>
          <el-form-item label="备    注">
            <editor ref="myTextEditor" :fileName="'uploadfile'" v-model="ruleForm.desc"
                    style="width: 90%;margin: 0 auto;text-align: left;"></editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save()">立即发布</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */
  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import Editor from '../common/editor.vue'
  import config from '../../api/config' // 引入config文件里，图片上传的方法第一步
  import {tokenDeploy, updateGoods, getGoodsDetail} from '../../api/index'
  export default {
    components: {
      editor: Editor,
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
//      ParentPage: '', // 接收上一页传过来的当前页数，以便返回时，还是当前页
        actionUrl: '',
        upLoadData: {
          date_time: '',
          type: 'goods'
        },
        selectedOptions: [],
        fileListPic: [],
        options: [],
        picArr: [],
        ruleForm: {
          userID: '',
          pwd: '',
          name: '',
          symbol: '',
          total: '',
          desc: '',
        },
        dialogImageUrl: '',
        dialogVisible: false,
        type: 'register'
      }
    },
    mounted () {
      this.actionUrl = config.uploadMaterialsPic // 引入config文件里，图片上传的方法第二步
    },
    created () {
      var date = new Date()
      this.upLoadData.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.title2 = this.$route.query.title
      this.ruleForm.id = this.$route.query.id
      this.getorgan()

      if (this.ruleForm.id != 0) {
        this.getContent()
      }
    },
    methods: {
      handleChange (value) {
        this.ruleForm.class_id = value[1]
        this.ruleForm.super_calssid = value[0]
      },
      getorgan () {
        var _this = this
        getClassfiy().then(function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            var obj = {
              value: res.data.data[i].id,
              label: res.data.data[i].name,
              children: []
            }
            _this.options.push(obj)
            for (var j = 0; j < res.data.data[i].subs.length; j++) {
              var obj2 = {
                value: res.data.data[i].subs[j].id,
                label: res.data.data[i].subs[j].name
              }
              obj.children.push(obj2)
            }
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      handleRemove (file, fileList) {
        console.log('fileListdel', fileList)
        this.picArr = [];
        for (var i = 0; i < fileList.length; i++) {
          console.log('i', fileList[i])
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
        console.log('del', this.picArr)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      successMessage (file, fileList) {
        var obj = fileList.response.data
        this.picArr.push(obj)
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        console.log('file', file);
      },

      save () {
        var myreg = /^[1][3,5,6,7,8][0-9]{9}$/;//验证userID(手机号)是否合法
        var totalreg = /^[0-9]*[1-9][0-9]*$/;   //判断是否为正整数
        if (!myreg.test(this.ruleForm.userID)) {
          this.$message({
            message: '请输入正确的用户手机号',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.pwd == '') {
          this.$message({
            message: '请输入用户密码',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.name == '') {
          this.$message({
            message: '请输入用户昵称',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.symbol == '') {
          this.$message({
            message: '请输入积分标识',
            type: 'warning'
          })
          return false
        }
        if (!totalreg.test(this.ruleForm.total)) {
          this.$message({
            message: '请输入发布的数量',
            type: 'warning'
          })
          return false
        }
        var _this = this

        tokenDeploy(this.ruleForm).then(function (res) {
           // alert(res.data.errcode)
          if (res.data.errcode == 0 ) {
            _this.$message({
              type: 'success',
              message: '发布成功!'
            })
            localStorage.setItem('key', res.data.msg); //返回随机字符串(token)  //保存在了本地
            _this.$router.push('/goodsList')
            window.close()
          } else if(res.data.errcode == 1) {
            _this.$message({
              type: 'error',
              message: '发布失败!'
            })
          }
        }).catch(function (err) {
          console.log(err)
          return false
        })
      }
    }
  }
</script>
<style scoped>
  .el-input, .el-select {
    width: 90%;
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

</style>
