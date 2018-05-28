<template>
  <div>
    <common-header :title="'商品管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'店长礼包'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="10" style="text-align: left;">
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="500" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="gift_name" label="礼包名" min-width="150"></el-table-column>
        <el-table-column prop="pic" label="封面图" style="text-align: center;" min-width="120">
          <template slot-scope="scope">
            <img :src="scope.row.pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="统一销售价格" min-width="150"></el-table-column>
        <el-table-column prop="store" label="总存库" style="text-align: center;"></el-table-column>
        <el-table-column prop="sales_volume" label="总销量"></el-table-column>
        <el-table-column label="操作" min-width="300">

          <template slot-scope="scope" >
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线</el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="shopBagListRow(scope.row.subject_id,scope.row.gift_name)" type="primary" size="mini"> 查看礼包商品</el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent,spaced-comment */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
   import {getGiftList,deleteCommonWithType} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        loading: true,
        isDasabled: true,
        occupation: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        successMsg: '',
        errorMsg: '',
        system_edit: '',
        tableData: [],

        params3: {
          id: '',
          token: '',
          table: 'gift_bag'
        },
        file: '',
        src: ''
      }
    },
    created () { // 一进页面就执行方法
      this.params3.token = window.sessionStorage.getItem('session')
      this.getData()
    },
    methods: {
      add () {
        this.$router.push({name: 'shopBagEdit', query: {title: '添加', id: 0}})
      },
      editRow (id) {
        this.$router.push({name: 'shopBagEdit', query: {title: '编辑', id: id}})
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
      shopBagListRow (subject_id,gift_name) {
        this.$router.push({name: 'shopBagList2', query: {gift_name: gift_name, subject_id: subject_id}})
      },
      getData () {
        var _this = this

        getGiftList().then(function (res) {
          _this.loading = false
           _this.tableData = res.data.data
         }).catch(function (err) {
           console.log(err)
         })
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
