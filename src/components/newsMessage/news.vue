<template>
  <div>
    <common-header :title="'消息管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'消息列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.keywords" placeholder="请输入" @keyup.enter="search()" ></el-input>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">发布消息</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="name" label="消息标题"></el-table-column>
        <el-table-column prop="sex" label="发送对象"></el-table-column>
        <el-table-column prop="time" label="发布时间" min-width="50"></el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="sendRow(scope.row._id)" type="primary" size="mini">发布/已发布</el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row._id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row._id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form style="" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="消息标题" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入消息标题"></el-input>
          </el-form-item>
          <el-form-item label="发送对象" prop="sex">
            <el-input v-model="ruleForm.sex" placeholder="请输入发送对象"></el-input>
          </el-form-item>
          <el-form-item label="发布时间" prop="time">
            <el-date-picker
              v-model="ruleForm.time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit()">确 定</el-button>
        </div>
      </el-dialog>

      <!--分页-->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="total_count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
// import {getUserList, lookUser, editUser, instructList, professionList} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      isDasabled: true,
      params55: {
        type: '1'
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogTitle: '',
      successMsg: '',
      errorMsg: '',
      tableData: [
        {
          name: '王颖',
          sex: '女',
          score: 50
        },
        {
          name: '王颖',
          sex: '女',
          score: 50
        }
      ],
      currentPage1: 1,
      total_count: 0,
      searchKey: '',
      params: {
        keywords: '',
        institution_name: '',
        start: '0',
        page_size: '10',
        token: ''
      },
      ruleForm: {// 编辑的弹框展示
        name: '',
        sex: '',
        time: '',
      },
      params3: { // table表格数据展示
        id: '',
        token: ''
      },
      ruleForm2: {// 编辑的弹框提交修改
        name: '',
        sex: '',
        time: ''
      },
      rules: {// 验证规则
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择发布时间', trigger: 'blur' }
        ]
      }

    }
  },
  created () { // 一进页面就执行方法
    this.params.token = window.localStorage.getItem('session')
    this.getData()
  },
  methods: {
    handleSizeChange (val) {
      this.params.page_size = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.params.start = val
      this.getData()
    },
    getData () {
      var _this = this
      // getUserList(this.params).then(function (res) {
      this.loading = false
      //   _this.tableData = res.data.data.userlist
      //   _this.total_count = res.data.data.count
      // }).catch(function (err) {
      //   console.log(err)
      // })
    },
    search () {
      this.getData()
    },
    add () {
      this.dialogTitle = '发布消息'
      this.dialogFormVisible = true
    },
    sendRow (_id) {
      var _this = this
      this.params3.id = _id
      /* lookUser(this.params3).then(function (res) {
       if (res.data.errcode == 0) {
       _this.ruleForm = res.data.data
       _this.isDasabled = true
       } else {

       }
       }).catch(function (err) {
       console.log(err)
       }) */
    },
    editRow (_id) {
      this.dialogTitle = '编辑消息'
      this.dialogFormVisible = true
    },
    delRow (_id) {
      this.$confirm('是否删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getData()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    commit () {
      var _this = this
      _this.ruleForm2.token = window.localStorage.getItem('session')
      _this.ruleForm2.user_id = window.localStorage.getItem('this_id')
      _this.ruleForm2.mobile = _this.ruleForm.mobile
      _this.ruleForm2.name = _this.ruleForm.name
      _this.ruleForm2.depart = _this.ruleForm.depart
      _this.ruleForm2.stu_no = _this.ruleForm.stu_no
      _this.ruleForm2.occupation = _this.ruleForm.occupation
      // _this.ruleForm2.profession = _this.ruleForm.profession;

      // editUser(_this.ruleForm2).then(function (res) {
      //   if (res.data.errcode == 0) {
      //     _this.$message({
      //       message: '成功',
      //       type: 'success'
      //     })
      //     //            _this.ruleForm = res.data.data
      //   } else {
      //     _this.$message({
      //       message: '失败',
      //       type: 'warning'
      //     })
      //   }
      //   _this.getData()
      // }).catch(function (err) {
      //   console.log(err)
      // })
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
