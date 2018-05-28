<template>
  <div>
    <common-header :title="'发现管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'发现列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.key_word" placeholder="标题名搜索" clearable @keyup.enter="search()"></el-input>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="dis" label="简介"></el-table-column>
        <el-table-column prop="materials_pic" label="素材图片" style="text-align: center;" min-width="120">
          <template slot-scope="scope">
            <img :src="scope.row.materials_pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名" style="text-align: center;"></el-table-column>
        <el-table-column prop="creat_time" label="时间" min-width="150"></el-table-column>
        <el-table-column label="操作" min-width="200">

          <template slot-scope="scope" >
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线</el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="bannerPicsRow(scope.row.subject_id,scope.row.goods_name)" type="primary" size="mini"> 素材图片</el-button>
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
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
import {getFindList, deleteCommonWithType} from '../../api/index'
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
      currentPage1: 1,
      total_count: 0,
      params: {
        key_word: '',
        page: '1',
        number: '10'
      },
      params3: {
        id: '',
        token: '',
        table: 'find_info'
      }
    }
  },
  created () { // 一进页面就执行方法
    this.params3.token = window.sessionStorage.getItem('session')
    // enter键快捷搜索
    var _this = this
    this.getData()
    document.onkeydown = function (e) {
      if (e.key == 'Enter') {
        _this.search()
      }
    }
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
      this.$router.push({name: 'addFind', query: {title: '添加', id: 0}})
    },
    editRow (id) {
//      this.$router.push({name: 'addFind', query : {title: '编辑', id: id}})
      const {href} = this.$router.resolve({
        name: 'addFind',
        query: {
          title: '编辑',
          id: id
        }
      })
      window.open(href, '_blank')
    },
    bannerPicsRow (subject_id, goods_name) {
      //    this.$router.push({name: 'BannerPics', query: {goods_name: goods_name, id: subject_id}})
      const {href} = this.$router.resolve({
        name: 'BannerPics',
        query: {
          goods_name: goods_name,
          id: subject_id
        }
      })
      window.open(href, '_blank')
    },
    getData () {
      var _this = this
      getFindList(this.params).then(function (res) {
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
