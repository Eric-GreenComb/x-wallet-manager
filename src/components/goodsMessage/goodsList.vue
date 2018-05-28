<template>
  <div>
    <common-header :title="'积分管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'积分列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.search" placeholder="请输入手机号前三位" clearable @keyup.enter="search()"></el-input>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">发布积分</el-button>
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
          width="100">
        </el-table-column>

        <el-table-column
          prop="symbol"
          label="symbol"
          width="100">
        </el-table-column>

        <el-table-column
          prop="userID"
          label="手机号"
          width="120">
        </el-table-column>

        <el-table-column label="address" width="150" prop="address">
          <template slot-scope="scope" >
            <span>************</span>
          </template>
          <!--address 暂时不可见   若修改为明文  注释这段 template标签即可-->
        </el-table-column>

        <el-table-column
          prop="total"
          label="总积分"
          width="150">
        </el-table-column>

        <el-table-column
          prop="desc"
          label="备 注"
          width="150">
        </el-table-column>

        <el-table-column
          prop="CreatedAt"
          label="发布时间"
          width="200">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="5"
          layout="total, prev, pager, next"
          :total="total_count">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */

import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getTokenList, getClassfiy, deleteCommonWithType, supportGoods} from '../../api/index'
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
  created () {
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
      getTokenList(str).then(function (res) {
        // console.log(res);
        _this.loading = false
        _this.tableData = res.data.msg
        _this.total_count = parseInt(res.data.msg.length)
      }).catch(function (err) {
      })
    },

    add () {
      this.$router.push({name: 'addGoodsList', query: {title: '发布积分', id: 0}})
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
    width: auto;
    height: 80px;
  }

</style>
