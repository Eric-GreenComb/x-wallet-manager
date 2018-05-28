<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="this.name+'_积分列表'"></common-header-tilte>
      <el-table :data="tableData" max-height="500" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="creat_time" label="创建时间" min-width="200"></el-table-column>
        <el-table-column prop="dis" label="描述"></el-table-column>
        <el-table-column prop="score" label="可用积分"></el-table-column>
        <el-table-column prop="total_score" label="总积分"></el-table-column>
        <el-table-column prop="user_type" label="用户类型">
          <template slot-scope="scope">
            <p v-if="scope.row.user_type == 'buy'">买</p>
            <p v-if="scope.row.user_type == 'sell'">卖</p>
            <p v-if="scope.row.user_type == 'voucher'">抵用券</p>
            <p v-if="scope.row.user_type == 'upgrade'">升级</p>
            <p v-if="scope.row.user_type == 'invite'">邀请</p>
            <p v-if="scope.row.user_type == 'strike'">结算</p>
            <p v-if="scope.row.user_type == 'other'">其它</p>
            <p v-if="scope.row.user_type == 'return'">退单</p>
            <p v-if="scope.row.user_type == 'cash'">变现</p>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <p v-if="scope.row.type == 'plus'">加</p>
            <p v-if="scope.row.type == 'minus'">减</p>
            <p v-if="scope.row.type == 'cash'">变现</p>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" min-width="300">
          <template slot-scope="scope" >
            &lt;!&ndash;<el-button style="margin: 0px 5px 5px" @click="lookRowScore(scope.row._id)" type="primary" size="mini"> 查看</el-button>&ndash;&gt;
          </template>
        </el-table-column>-->
      </el-table>
      <!--分页-->
      <div class="block">
        <el-pagination
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
import {getUserscoreList} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      tableData: [],
      currentPage1: 1,
      total_count: 0,
      name: '',
      params: {
        user_id: '',
        page: 1,
        number: 10
      }
    }
  },
  created () { // 一进页面就执行方法
    this.params.user_id = this.$route.query.id
    this.name = this.$route.query.name
    this.getData()
  },
  methods: {
    handleCurrentChange (val) {
      this.params.page = val
      this.getData()
    },
    getData () {
      var _this = this
      getUserscoreList(this.params).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data.data
        _this.total_count = parseInt(res.data.data.count)
      }).catch(function (err) {
      })
    },
    search () {
      this.params.page = 1
      this.handleCurrentChange (1)
      this.getData()
    }
  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }

</style>
