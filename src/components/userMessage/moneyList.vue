<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="this.name+'_奖金列表'"></common-header-tilte>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="head_pic" label="头像" min-width="100">
          <template slot-scope="scope">
            <img :src="scope.row.head_pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="creat_time" label="创建时间" min-width="200"></el-table-column>
        <el-table-column prop="dis" label="描述"></el-table-column>
        <el-table-column prop="total_money" label="总金额"></el-table-column>
        <el-table-column prop="enable_money" label="可用金额"></el-table-column>
        <el-table-column prop="money" label="收益金额"></el-table-column>
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
  import {getMyTrade} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        loading: true,
        isDasabled: true,
        tableData: [],
        currentPage1: 1,
        total_count: 0,
        name: '',
        params: {
          user_id: '',
          page: 1,
          number: 10
        },
        params3: { // table表格数据展示
          id: '',
          token: ''
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
        getMyTrade(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
        }).catch(function (err) {
        })
      },
      search () {
        this.getData()
      }
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
