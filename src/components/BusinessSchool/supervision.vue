<template>
  <div>
    <common-header :title="'商学院'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'监督'"></common-header-tilte>
      <el-table :data="tableData" max-height="550" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="head_pic" label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.head_pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="is_serious" label="是否认真">
          <template slot-scope="scope">
            <span v-if="scope.row.is_serious == 1">认真</span>
            <span v-if="scope.row.is_serious == 0">不认真</span>
          </template>
        </el-table-column>

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
import {supervise_study} from '../../api/index'
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
      params: {
        article_id: '',
        page: 1,
        number: 10
      }
    }
  },
  created () { // 一进页面就执行方法
    this.params.article_id = this.$route.query.id
    this.getData()
  },
  methods: {
    handleCurrentChange (val) {
      this.params.page = val
      this.getData()
    },
    getData () {
      var _this = this
      supervise_study(this.params).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data.data
        _this.total_count = parseInt(res.data.data.count)
      }).catch(function (err) {
        console.log(err)
      })
    },
    search () {
      this.params.page = 1
      this.handleCurrentChange(1)
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
    width: auto;
    height: 80px;
  }

</style>
