<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'购买列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.keywords" suffix-icon="el-icon-search" placeholder="标题名搜索" @keyup.enter="search()" ></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-select v-model="occupation" clearable placeholder="会员" style="width: 100%;" @change="selectRank($event)">
              <el-option
                v-for="item in options"
                :key="item.occupation"
                :label="item.label"
                :value="item.occupation">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" @click="search()">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="money" label="奖金"></el-table-column>
        <el-table-column prop="score" label="积分"></el-table-column>
        <el-table-column prop="jibie" label="级别"></el-table-column>
        <el-table-column label="操作" min-width="300">

          <template slot-scope="scope" >
            <!--<el-button style="margin: 0px 5px 5px" @click="lookRowScore(scope.row._id)" type="primary" size="mini"> 查看</el-button>-->
          </template>
        </el-table-column>
      </el-table>
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
      options: [
        {
          occupation: '会员',
          label: '会员'
        },
        {
          occupation: '非会员',
          label: '非会员'
        }
      ],
      params55: {
        type: '1'
      },
      occupation: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogTitle: '',
      successMsg: '',
      errorMsg: '',
      system_edit: '',
      tableData: [
        {
          name: '王颖',
          sex: '女',
          mobile: 13465987456,
          money: 15236,
          score: 50,
          jibie: '2星级'
        },
        {
          name: '王颖',
          sex: '女',
          mobile: 13465987456,
          money: 15236,
          score: 50,
          jibie: '2星级'
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
      params2: { // 加入黑名单传入
        id: ''
      },
      ruleForm: {// 编辑的弹框展示
        name: '',
        sex: '',
        mobile: '',
        money: '',
        score: '',
        jibie: ''
      },
      params3: { // table表格数据展示
        id: '',
        token: ''
      },
      ruleForm2: {// 编辑的弹框提交修改
        name: '',
        sex: '',
        mobile: '',
        money: '',
        score: '',
        jibie: ''
      },
      rules: {// 验证规则
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        mobile: [
          { required: true }
        ],
        money: [
          { required: true, message: '请输入奖金', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入积分', trigger: 'blur' }
        ],
        jibie: [
          { required: true, message: '请输入级别', trigger: 'blur' }
        ]
      }

    }
  },
  created () { // 一进页面就执行方法
    this.params.token = window.localStorage.getItem('session')
    this.getData()
    this.getorgan()
  },
  methods: {
    getorgan () {
      var _this = this
      // instructList(this.params55).then(function (res) {
      //   for (var i = 0; i < res.data.data.instruct_list.length; i++) {
      //     var obj = {
      //       occupation: res.data.data.instruct_list[i].name,
      //       label: res.data.data.instruct_list[i].name
      //     }
      //     _this.options.push(obj)
      //   }
      //   // _this.occupation = res.data.data.instruct_list[0].name;
      // }).catch(function (err) {
      //   console.log(err)
      // })
    },
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
    selectRank (val) {
      // this.params.institution_name = val
    },
    search () {
      this.getData()
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

</style>
