<template>
  <div>
    <common-header :title="'系统管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'积分兑换抵用券'"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="pic_url" label="图片" min-width="200">
          <template slot-scope="scope">
            <img :src="(scope.row).pic_url" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="limit_price" label="最小限额" min-width="120"></el-table-column>
        <el-table-column prop="price_value" label="面值" min-width="180"></el-table-column>
        <el-table-column prop="dis" label="描述"></el-table-column>
        <el-table-column prop="score" label="所需积分" style="text-align: center;" min-width="100"></el-table-column>
        <el-table-column prop="term_date" label="期限" min-width="160"></el-table-column>
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线</el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="最小限额" prop="limit_price">
            <el-input v-model="ruleForm.limit_price" placeholder="请输入最小限额" clearable></el-input>
          </el-form-item>
          <el-form-item label="面值" prop="price_value">
            <el-input v-model="ruleForm.price_value" placeholder="请输入面值" clearable></el-input>
          </el-form-item>
          <el-form-item label="期限" prop="term_date">
            <el-input v-model="ruleForm.term_date" placeholder="请输入期限" clearable></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="dis">
            <el-input v-model="ruleForm.dis" placeholder="请输入描述" clearable></el-input>
          </el-form-item>
          <el-form-item label="所需积分" prop="score">
            <el-input v-model="ruleForm.score" placeholder="请输入所需积分" clearable></el-input>
          </el-form-item>
          <el-form-item label="图 片（234*134）" prop="pic" >
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
  import {getVoucherList, getVoucherDetail, uploadMaterialsPic, deleteCommonWithType, addEditVoucher} from '../../api/index'
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
        dialogFormVisible: false,
        dialogTitle: '',
        loading: true,
        system_edit: '',
        tableData: [],
        params3: { // 删除上下线
          id: '',
          type: '',
          token: '',
          table: 'voucher_classfy'
        },
        params2: {
          user_type: 'cov',
          m_rank: ' '
        },
        ruleForm: {
          id: '',
          limit_price: '',
          price_value: '',
          term_date: '',
          dis: '',
          pic_url: '',
          score: '',
          token: '',
          user_type: 'cov',
          m_rank: ''
        }
      }
    },
    created () { // 一进页面就执行方法
      this.getData()
      this.params3.token = window.sessionStorage.getItem('session')
      this.ruleForm.token = window.sessionStorage.getItem('session')
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
        formData.append('type', 'voucher');
        formData.append('date_time', '');
        this.isShowTrue = false;
        uploadMaterialsPic(formData).then(function (res) {

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
            _this.ruleForm.pic_url = res.data.data.pic_name;
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
        getVoucherList(this.params2).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
        }).catch(function (err) {
        })
      },
      add () {
        this.dialogTitle = '添加'
        this.dialogFormVisible = true
        this.ruleForm.id = 0
        this.ruleForm.limit_price = ''
        this.ruleForm.price_value = ''
        this.ruleForm.term_date = ''
        this.ruleForm.dis = ''
        this.ruleForm.score = ''
        this.src = ''
      },
      editRow (id) {
        this.dialogTitle = '编辑'
        this.dialogFormVisible = true
        this.ruleForm.id = id
        this.getContent(id)
      },
      getContent (id) {
        var _this = this;
        getVoucherDetail({voucher_id: id}).then(function (res) {
          console.log('res',res)
          _this.ruleForm.limit_price = res.data.data.limit_price
          _this.ruleForm.price_value = res.data.data.price_value
          _this.ruleForm.type = res.data.data.pic.type
          _this.ruleForm.term_date = res.data.data.term_date
          _this.ruleForm.score = res.data.data.score
          _this.ruleForm.dis = res.data.data.dis
          _this.ruleForm.pic_url = res.data.data.pic.pic_name
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
          deleteCommonWithType(this.params3).then(function (res) {
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
        this.params3.id = id
        this.params3.type = 'delete'
        var _this = this
        this.$confirm('是否删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCommonWithType(this.params3).then(function (res) {
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

        if (this.ruleForm.limit_price == ''){
          this.$message({
            type: 'warning',
            message: '最小限额不能为空哦'
          })
          return
        }

        if (this.ruleForm.price_value == ''){
          this.$message({
            type: 'warning',
            message: '面值不能为空哦'
          })
          return
        }

        if (this.ruleForm.term_date == ''){
          this.$message({
            type: 'warning',
            message: '期限不能为空哦'
          })
          return
        }

        if (this.ruleForm.dis == ''){
          this.$message({
            type: 'warning',
            message: '描述不能为空哦'
          })
          return
        }

        if (this.ruleForm.score == ''){
          this.$message({
            type: 'warning',
            message: '所需积分不能为空哦'
          })
          return
        }

        if (this.ruleForm.pic_url == ''){
          this.$message({
            type: 'warning',
            message: '请选择图片哦'
          })
          return
        }

        addEditVoucher(this.ruleForm).then(function (res) {
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
    max-width:234px;
    width:234px;
    height:134px;
  }

</style>
