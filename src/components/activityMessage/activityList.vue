<template>
  <div>
    <common-header :title="'活动管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'活动列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.key_word" placeholder="标题名搜索" clearable></el-input>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()"
                       @keyup.enter="search()">搜索
            </el-button>
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="pic" label="封面图" style="text-align: center;" min-width="200">
          <template slot-scope="scope">
            <img :src="scope.row.pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="creat_time" label="时间" min-width="120" format="yyyy-MM-dd HH:mm:ss"
                         value-format="yyyy-MM-dd HH:mm:ss"></el-table-column>
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope">
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑
            </el-button>
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线
            </el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px"
                       @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线
            </el-button>
            <el-button v-if="scope.row.is_stick == 1" style="margin: 0px 5px 5px"
                       @click="isShareRow(scope.row.is_stick,scope.row.id)" type="primary" size="mini"> 店铺可分享
            </el-button>
            <el-button v-if="scope.row.is_stick == 0" style="margin: 0px 5px 5px"
                       @click="isShareRow(scope.row.is_stick,scope.row.id)" type="primary" size="mini"> 店铺不可分享
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
  import {deleteCommonWithType, getActivityList, uploadActivityShare} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        tag_id: '',
        loading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        successMsg: '',
        errorMsg: '',
        system_edit: '',
        src: '',
        file: '',
        options: [],
        tableData: [],
        currentPage1: 1,
        total_count: 0,
        params: {
          key_word: '',
          page: '1',
          number: '10'
        },
        ruleForm: {// 编辑的弹框展示
          name: '',
          sex: '',
          mobile: '',
          money: '',
          score: '',
          jibie: ''
        },
        params3: { // 删除，上下线
          id: '',
          token: '',
          table: 'system_activity'
        },
        params2: { // 分享不可分享
          id: '',
          token: '',
          type: ''
        }
      }
    },
    created () { // 一进页面就执行方法
      this.params3.token = window.sessionStorage.getItem('session')
      this.params2.token = window.sessionStorage.getItem('session')
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
      handleSizeChange (val) {
        this.params.number = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getData()
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
      isShareRow (is_stick, id) {
        var _this = this
        this.params2.id = id
        if (is_stick == 0) {
          this.params2.type = 'on'
          this.textMessage = '店铺是否可分享, 是否继续?'
          this.successMsg = '店铺已设置为可分享！'
          this.errorMsg = '已取消设置'
        } else {
          this.params2.type = 'off'
          this.textMessage = '店铺是否可分享, 是否继续?'
          this.successMsg = '店铺已设置为不可分享！'
          this.errorMsg = '已取消设置'
        }

        this.$confirm(this.textMessage, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          uploadActivityShare(this.params2).then(function (res) {
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
      add () {
        this.$router.push({name: 'addActivity', query: {title: '新建活动', id: 0}})

      },
      editRow (id) {
//        this.$router.push({name: 'addActivity', query: {title: '编辑活动', id: id}})
        const {href} = this.$router.resolve({
          name: 'addActivity',
          query: {
            title: '编辑活动',
            id: id
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
        getActivityList(this.params).then(function (res) {
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
