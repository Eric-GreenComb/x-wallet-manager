<template>
  <div>
    <common-header :title="'系统管理'"></common-header>
    <div class="page-content">
      <common-header-tilte title2="修改管理员密码" ></common-header-tilte>
      <div style="margin-top: 10px;">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="手机号">
            <el-input v-model="ruleForm.userid" placeholder="请输入用户手机号" clearable maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="原始密码">
            <el-input v-model="ruleForm.old" placeholder="请输入原始密码 字母+数字 6--20位" clearable type="password" ></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="ruleForm.new" placeholder="请输入新密码 字母+数字 6--20位" clearable type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="ruleForm.new2" placeholder="请确认新密码 字母+数字 6--20位" clearable type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save()">立即修改</el-button>
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
  import {updatePass, updateGoods, getGoodsDetail} from '../../api/index'
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
          userid: '',
          old: '',
          new: '',
          new2:''
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
      //this.getorgan()

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
        if (!myreg.test(this.ruleForm.userid)) {
          this.$message({
            message: '请输入正确的用户手机号',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.old == '') {
          this.$message({
            message: '请输入原始密码',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.new == '') {
          this.$message({
            message: '请输入新密码',
            type: 'warning'
          })
          return false
        }
        if (this.ruleForm.new != this.ruleForm.new2) {
          this.$message({
            message: '两次输入密码不一致',
            type: 'warning'
          })
          return false
        }
        var _this = this
        var str = ''+'/'+this.ruleForm.userid+'/'+this.ruleForm.old+'/'+this.ruleForm.new;
        updatePass(str).then(function (res) {
          // alert(res.data)
          if (res.data.errcode == 0) {
            _this.$message({
              type: 'success',
              message: '修改成功,请重新登录!'
            })
           // window.location.reload(); //刷新页面  下次登录
            // ② 退出系统 重新登录
            _this.$router.push('/')
            window.localStorage.clear()
          } else {
            _this.$message({
              type: 'error',
              message: '修改失败!'
            })
            window.location.reload();
          }
        }).catch(function (err) {
          console.log(err)
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
