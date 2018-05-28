<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'用户列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.search" placeholder="请输入手机号前三位搜索" clearable @keyup.enter="search()" ></el-input>
          </el-col>
          <el-col :span="3" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" @click="search()">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column
          prop="ID"
          label="#"
          width="50">
        </el-table-column>

        <el-table-column
          prop="name"
          label="昵 称"
          width="120">
        </el-table-column>

        <el-table-column
          prop="userID"
          label="手机号"
          width="120">
        </el-table-column>

        <el-table-column label="密码" width="120">
          <template slot-scope="scope" >
           <span>**********</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮 箱"
          width="200">
        </el-table-column>

        <el-table-column
          prop="CreatedAt"
          label="注册日期"
          width="220">
        </el-table-column>

        <el-table-column
          prop="UpdatedAt"
          label="更新日期"
          width="220">
        </el-table-column>

      </el-table>


      <!--分页-->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
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
import {getUserList} from '../../api/index'
import {userCount} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      isDasabled: true,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dialogTitle: '',
      successMsg: '',
      errorMsg: '',
      system_edit: '',
      tableData: [],
      currentPage1: 1,
      total_count: 0,
      params: {
        search: '',
        page: 1,
      },
    }
  },
  created () { // 一进页面就执行方法
    this.getData()
    // enter键快捷搜索
    var _this = this
    document.onkeydown = function (e) {
      if (e.key == 'Enter') {
        _this.search()
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log('val',val)
      this.params.page = val
      this.getData()
    },
     getData () {
      var _this = this
       var str = '/'+this.params.search+'/'+this.params.page;
      getUserList(str).then(function (res) {
       // console.log(res);
        _this.loading = false
        _this.tableData = res.data
        //获取用户数量
        userCount().then(function (res) {
          //console.log(res)
          if(res.data.errcode == 0){
            _this.total_count = res.data.msg;   //用户的数量 27人
          }
        }).catch(function (err) {
          console.log(err)
        })

      }).catch(function (err) {
      })
    },
    //搜索管理员
    search () {
      this.params.page = 1
      this.getData()
    },
  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }

  .table_pic{
    width:100%;
  }

</style>
