<template>
  <div>
    <common-header :title="'商品管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'小类管理'"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column label="排序号" prop="order_nu"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="pic.url" label="图片">
          <template slot-scope="scope">
            <img :src="(scope.row).pic.pic_url" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" v-if="scope.row.is_show == 1" @click="isUpRow(scope.row.is_show, scope.row.id)" type="primary" size="mini">上线</el-button>
            <el-button style="margin: 0px 5px 5px" v-if="scope.row.is_show == 0" @click="isUpRow(scope.row.is_show, scope.row.id)" type="info" size="mini">下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="排 序 号" prop="order_nu">
            <el-input v-model="ruleForm.order_nu" placeholder="请输入排序号" clearable></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入编码" clearable></el-input>
          </el-form-item>
          <el-form-item label="图 片（110*110）" prop="pic" >
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
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getCalssfy, deleteCalssfy, getClassfyDetail, uploadCalssfyPic, addClassfy} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        isShowTrue: true,
        date_time: '',
        pic: '',
        file: '',
        src: '',
        loading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        successMsg: '',
        errorMsg: '',
        textMessage: '',
        tableData: [],
        ids: 0,
        params: { // table表格数据展示
          super_id: 1
        },
        ruleForm: {// 编辑的弹框展示
          name: '',
          code: '',
          id: '',
          super_id: 1,
          pic: '',
          order_nu: 0
        },
        params3: {
          id: '',
          type: ''
        }
      }
    },
    created () { // 一进页面就执行方法
      this.params.super_id = this.$route.query.id
      var date = new Date()
      this.date_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      this.getData()
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
        this.isShowTrue = false;
        uploadCalssfyPic(formData).then(function (res) {

          if(res.data.errcode==1){
            _this.$message({
              message: '上传图片失败，请重新上传',
              type: 'warning'
            });
            return false;
          } else {
            var obj = {};
            obj['type'] = _this.type;
            obj.value = res.data.data;
            _this.ruleForm.pic = res.data.data.pic_name;
            _this.isShowTrue = true;
            return true;
          }
        }).catch(function (err) {
          console.log(err);
          _this.isShowTrue = true;
        })
      },
      getData () {
        var _this = this
        getCalssfy(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
        }).catch(function (err) {
        })
      },
      add () {
        this.dialogTitle = '添加'
        this.dialogFormVisible = true
        this.ruleForm.id = 0
        this.ruleForm.super_id = this.params.super_id
        this.ruleForm.name = ''
        this.ruleForm.code = ''
        this.src = ''
        this.ruleForm.order_nu = ''
      },
      editRow (id) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.ruleForm.id = id
        this.getContent(id)
      },
      getContent (id) {
        var _this = this;
        getClassfyDetail({id: id}).then(function (res) {
          console.log('res',res)
          _this.ruleForm.name = res.data.data.name
          _this.ruleForm.code = res.data.data.code
          _this.ruleForm.pic = res.data.data.pic.pic_name
          _this.ruleForm.order_nu = res.data.data.order_nu
          _this.src = res.data.data.pic.pic_url
        }).catch(function (err) {
          console.log(err)
        })
      },
      isUpRow (is_show, id) {
        var _this = this
        this.params3.id = id
        if (is_show == 0 ){
          this.params3.type = 'on'
          this.textMessage = '是否上线, 是否继续?'
          this.successMsg = '上线成功！'
          this.errorMsg = '已取消上线'
        } else {
          this.params3.type = 'off'
          this.textMessage = '是否下线, 是否继续?'
          this.successMsg = '下线成功！'
          this.errorMsg = '已取消下线'
        }

        this.$confirm(this.textMessage, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCalssfy(this.params3).then(function (res) {
            if (res.data.errcode == 0) {
              _this.ruleForm = res.data.data
              _this.$message({
                type: 'success',
                message: _this.successMsg
              })
              _this.getData()
            }
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.errorMsg
          })
        })
      },
      delRow (id) {
//        this.params3.id = id
//        this.params3.type = 'delete'
        var _this = this
        this.$confirm('是否删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCalssfy({id: id, type: 'delete'}).then(function (res) {
            if (res.data.errcode == 0) {
//              _this.ruleForm = res.data.data
              _this.$message({
                type: 'success',
                message: '删除成功'
              })
              _this.getData()
            }
          }).catch(function (err) {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      commit () {
        var _this = this
        var reg = /^[0-9]*$/;

        if (this.ruleForm.order_nu == ''){
          this.$message({
            type: 'warning',
            message: '排序号不能为空哦'
          })
          return
        }
        if(!reg.test(this.ruleForm.order_nu)){
          this.$message({
            type: 'warning',
            message: '排序号必须是数字哦'
          })
          return
        }

        if (this.ruleForm.name == ''){
          this.$message({
            type: 'warning',
            message: '名称不能为空哦'
          })
          return
        }

        if (this.ruleForm.code == ''){
          this.$message({
            type: 'warning',
            message: '编码不能为空哦'
          })
          return
        }

        if (this.ruleForm.pic == ''){
          this.$message({
            type: 'warning',
            message: '请选择图片哦'
          })
          return
        }
        addClassfy(this.ruleForm).then(function (res) {
          if (res.data.errcode == 0) {
            _this.$message({
              message: '成功',
              type: 'success'
            })
//            _this.ruleForm.name = ''
//            _this.ruleForm.code = ''
//            _this.src = ''
          } else {
            _this.$message({
              message: '失败',
              type: 'warning'
            })
          }
          _this.getData()
        }).catch(function (err) {
          console.log(err)
        })
        this.dialogFormVisible = false
      }
    }
  }
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }
  .table_pic{
    width: auto;
    height: 80px;
  }
  .img-box img{
    width:140px;
    height:140px;
  }

</style>
