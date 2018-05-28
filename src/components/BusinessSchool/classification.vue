<template>
  <div>
    <common-header :title="'商学院'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'分类'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-select v-model="type" clearable placeholder="类型"  @change="editClassfiy2($event)">
              <el-option label="论语学习" value="article"></el-option>
              <el-option label="课件" value="material"></el-option>
            </el-select>
          </el-col>
          <el-col :span="18" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" @click="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="name" label="名 称"></el-table-column>
        <el-table-column prop="sex" label="类 型">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='material'">课件</span>
            <span v-if="scope.row.type=='article'">论语学习</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id,scope.row.name,scope.row.type)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form style="" :model="ruleForm"  ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="名 称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称" auto-complete="off" clearable></el-input>
          </el-form-item>
          <el-form-item label="类 型" >
            <el-select v-model="ruleForm.type" clearable placeholder="类型"  @change="editClassfiy($event)">
              <el-option label="论语学习" value="article"></el-option>
              <el-option label="课件" value="material"></el-option>
            </el-select>
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
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getCollegeClassfy, addTags, deleteCommonWithType} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogTitle: '',
      tableData: [],
      type: '',
      params: {
        type: 'all'
      },
      params3: { // table表格数据展示
        id: '',
        token: '',
        table: 'study_tags'
      },
      ruleForm: {// 编辑的弹框展示
        id: '',
        name: '',
        type: '',
        token: ''
      },
      paramsDele: { // table表格数据展示
        id: '',
        type: 'delete',
        token: '',
        table: 'study_tags'
      }
    }
  },
  computed: {

  },
  created () { // 一进页面就执行方法
    this.ruleForm.token = window.sessionStorage.getItem('session')
    this.paramsDele.token = window.sessionStorage.getItem('session')
    this.params3.token = window.sessionStorage.getItem('session')
    this.getData()
  },
  methods: {
    editClassfiy (val){
      console.log('this.ruleForm.type',val)
      this.ruleForm.type = val;
    },
    editClassfiy2 (val){
      console.log('this.type',val)
      this.params.type = val;
    },
    add () {
      this.ruleForm.name = ''
      this.ruleForm.type = ''
      this.dialogFormVisible = true
      this.dialogTitle = '添加'
      this.ruleForm.id = 0
    },
    editRow (id,name,type) {
      this.dialogFormVisible = true
      this.dialogTitle = '编辑'
      this.ruleForm.id = id
      this.ruleForm.name = name
      this.ruleForm.type = type
    },
    delRow (id) {
      var _this = this;
      this.$confirm('是否删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.params3.type = 'delete'
        this.params3.id = id
        deleteCommonWithType(this.params3).then(function (res) {
          if (res.data.errcode == 0) {
            _this.$message({
              type: 'success',
              message: '删除成功'
            })
            _this.getData()
          }
        }).catch(function (err) {
          console.log(err)
        })
        this.getData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getData () {
      var _this = this
      if(this.params.type == ''){
        this.params.type = 'all'
      }
      getCollegeClassfy(this.params).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data
      }).catch(function (err) {
        console.log(err)
      })
    },
    search () {
      this.getData()
    },
    commit () {
      var _this = this
      if (this.ruleForm.name == ''){
        this.$message({
          message: '请输入名称',
          type: 'warning'
        })
        return;
      }

      if (this.ruleForm.type == ''){
        this.$message({
          message: '请选择类型',
          type: 'warning'
        })
        return;
      }
      addTags(this.ruleForm).then(function (res) {
        if (res.data.errcode == 0) {
          _this.$message({
            message: '成功',
            type: 'success'
          })
          _this.getData();
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
    height: 50px;
  }

</style>
