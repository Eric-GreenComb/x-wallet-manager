<template>
  <div>
    <common-header :title="'商学院'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'课件'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.key_word" placeholder="标题名搜索" clearable @keyup.enter="search()"></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-select v-model="tag_id" clearable placeholder="类型" style="width: 100%;" @change="selectRank($event)">
              <el-option
                v-for="item in options"
                :key ='item.id'
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="120"></el-table-column>
        <el-table-column prop="pic" label="封面图" min-width="120">
          <template slot-scope="scope">
            <img :src="scope.row.pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="dis" label="简介" min-width="180"></el-table-column>
        <el-table-column prop="tag_name" label="类型"></el-table-column>
        <el-table-column prop="author" label="作者" style="text-align: center;" min-width="100"></el-table-column>
        <el-table-column prop="creat_time" label="时间" min-width="160"></el-table-column>
        <el-table-column label="操作" min-width="300">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button v-if="scope.row.is_show == 1" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="primary" size="mini">已上线</el-button>
            <el-button v-if="scope.row.is_show == 0" style="margin: 0px 5px 5px" @click="isUpRow(scope.row.is_show,scope.row.id)" type="info" size="mini">已下线</el-button>
            <el-button style="margin: 0px 5px 5px" @click="jiandu(scope.row.id)" type="primary" size="mini"> 监督 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
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
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getCollegeMaterialList, getCollegeClassfy, deleteCommonWithType} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        loading: true,
        options: [],
        system_edit: '',
        tableData: [],
        currentPage1: 1,
        total_count: 0,
        tag_id: '',
        params: {
          key_word: '',
          tag_id: '',
          type: 'material',
          page: 1,
          number: 10
        },
        params3: { // table表格数据展示
          id: '',
          token: '',
          table: 'study_article'
        }
      }
    },
    created () { // 一进页面就执行方法
      this.getData()
      this.getorgan()
      this.params3.token = window.sessionStorage.getItem('session')

      // enter键快捷搜索
      var _this = this
      document.onkeydown = function (e) {
        if (e.key == 'Enter') {
          _this.search()
        }
      }
    },
    methods: {
      jiandu (id) {
//      this.$router.push('/supervision')
        const {href} = this.$router.resolve({
          name: 'supervision',
          query: {
            title: '监督',
            id: id
          }
        })
        window.open(href, '_blank')
      },
      selectRank (val) {
        this.params.tag_id = val
      },
      search () {
        this.params.page = 1
        this.handleCurrentChange(1)
        this.getData()
      },
      getorgan () {
        var _this = this
        getCollegeClassfy({type: 'all'}).then(function (res) {
          console.log('all',res.data.data)
          for (var i = 0; i < res.data.data.length; i++) {
            var obj = {
              name: res.data.data[i].name,
              id: res.data.data[i].id
            }
            _this.options.push(obj)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      handleCurrentChange (val) {
        this.params.page = val
        this.getData()
      },
      add () {
        this.$router.push({name: 'addnewPic', query: {title: '新建课件', id: 0}})
      },
      editRow (id) {
//        this.$router.push({name: 'addnewPic', query: {title: '编辑课件', id: id}})
        const {href} = this.$router.resolve({
          name: 'addnewPic',
          query: {
            title: '编辑课件',
            id: id
          }
        })
        window.open(href, '_blank')
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
      getData () {
        var _this = this
        if (this.tag_id == ''){
          this.params.tag_id = 0
        }
        getCollegeMaterialList(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data.data
          _this.total_count = parseInt(res.data.data.count)
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
    height: 50px;
  }

</style>
