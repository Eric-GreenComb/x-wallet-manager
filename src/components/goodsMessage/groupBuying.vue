<template>
  <div>
    <common-header :title="'商品管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'团购'"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="500" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="goods_name" label="商品名" min-width="120"></el-table-column>
        <el-table-column prop="pics" label="图片" style="text-align: center;" min-width="120">
          <template slot-scope="scope">
            <img :src="scope.row.pics" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="开始时间" min-width="180" format="yyyy-MM-dd HH:mm:ss"
                         value-format="yyyy-MM-dd HH:mm:ss"></el-table-column>
        <el-table-column prop="end_time" label="结束时间" min-width="180" format="yyyy-MM-dd HH:mm:ss"
                         value-format="yyyy-MM-dd HH:mm:ss"></el-table-column>
        <el-table-column prop="store" label="总存库" style="text-align: center;"></el-table-column>
        <el-table-column prop="sales_volume" label="总销量"></el-table-column>
        <el-table-column prop="start_quantity" label="成员标准（人）"></el-table-column>
        <el-table-column prop="zt" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state=='beging'">未开始</span>
            <span v-if="scope.row.state=='ongoing'">进行中</span>
            <span v-if="scope.row.state=='end'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="300">

          <template slot-scope="scope">
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线
            </el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线
            </el-button>
            <el-button  v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑</el-button>
            <el-button  v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini" disabled> 编辑</el-button>
            <el-button  v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="editMoneyRow(scope.row.goods_id)" type="primary" size="mini">
              编辑价格
            </el-button>
            <el-button  v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="editMoneyRow(scope.row.goods_id)" type="primary" size="mini" disabled>
              编辑价格
            </el-button>
            <el-button  v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="editSizeRow(scope.row.goods_id)" type="primary" size="mini">
              编辑规格
            </el-button>
            <el-button  v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="editSizeRow(scope.row.goods_id)" type="primary" size="mini" disabled>
              编辑规格
            </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除
            </el-button>
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
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getActivityGoods, deleteCommonWithType} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        file: '',
        src: '',
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
        searchKey: '',
        params: {
          type: 'group',
          page: 1,
          number: '10'
        },
        params3: { // table表格数据展示
          id: '',
          token: '',
          table: 'goods_activeinfo'
        }
      }
    },
    created () { // 一进页面就执行方法
      this.getData()
      this.params3.token = window.sessionStorage.getItem('session')
    },
    methods: {
      handleSizeChange (val) {
        this.params.page_size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getData()
      },
      add () {
        this.$router.push({name: 'addGroup', query: {title: '添加', id: 0}})
      },
      editRow (id) {
//        this.$router.push({name: 'addGroup', query: {title: '编辑', id: id}})
        const {href} = this.$router.resolve({
          name: 'addGroup',
          query: {
            id: id
          }
        })
        window.open(href, '_blank')
      },
      isUpRow (is_show, id) {
        var _this = this
        this.params3.id = id
        if (is_show == 0) {
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
      editMoneyRow (goods_id) {
//        this.$router.push({name: 'priceEdit', query: {id: goods_id}})
        const {href} = this.$router.resolve({
          name: 'priceEdit',
          query: {
            id: goods_id
          }
        })
        window.open(href, '_blank')
      },
      editSizeRow (goods_id) {
//        this.$router.push({name: 'sizeList', query: {id: goods_id}});
        const {href} = this.$router.resolve({
          name: 'sizeList',
          query: {
            id: goods_id
          }
        })
        window.open(href, '_blank')
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
        getActivityGoods(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
        }).catch(function (err) {
          console.log(err)
        })
      },
      search () {
        this.getData()
      }
    }
  }
</script>
<style scoped>
  .el-input, .el-select {
    width: 90%;
  }

  .table_pic {
    width: auto;
    height: 80px;
  }

</style>
