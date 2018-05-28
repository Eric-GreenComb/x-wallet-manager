<template>
  <div>
    <common-header :title="'系统管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'常见问题'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-select v-model="type1" clearable placeholder="类型" style="width: 100%;" @change="selectRank($event)">
              <el-option
                v-for="item in options"
                :key ='item.id'
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" icon="el-icon-search" @click="search()" @keyup.enter="search()">搜索</el-button>
            <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="faq_type" label="类型" min-width="200">
          <template slot-scope="scope">
            <p v-if="scope.row.faq_type == 'shop'">店长宝典</p>
            <p v-if="scope.row.faq_type == 'sales_sv'">售后问题</p>
            <p v-if="scope.row.faq_type == 'logitics'">物流查询</p>
            <p v-if="scope.row.faq_type == 'activity'">活动资讯</p>
            <p v-if="scope.row.faq_type == 'order'">订单科普</p>
          </template>
        </el-table-column>
        <el-table-column prop="order_nu" label="排序"></el-table-column>
        <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
        <el-table-column prop="content" label="内容" min-width="400">
          <template slot-scope="scope">
            <p  v-html="scope.row.content">{{scope.row.content}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="130">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" label-position="right" label-width="120px" class="demo-ruleForm">
          <el-form-item label="排序">
            <el-input v-model="ruleForm.order_nu" placeholder="请输入排序数" style="width: 100%;" clearable></el-input>
          </el-form-item>
          <el-form-item label="问题类型">
            <el-select v-model="tag_id" placeholder="请选择问题类型" style="width: 100%;" @change="selectRank2($event)">
              <el-option
                v-for="item in options"
                :key ='item.id'
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="问题">
            <el-input v-model="ruleForm.title" placeholder="请输入问题名称" style="width: 100%;" clearable></el-input>
          </el-form-item>
          <el-form-item label="答案">
            <el-input type="textarea" :rows="3" v-model="ruleForm.content" placeholder="请输入答案" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="commit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */

  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {getFaqList, getFaqType, getFaqDetail, deleteCommonWithType, addEditFaq} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        dialogFormVisible: false,
        dialogTitle: '',
        loading: true,
        system_edit: '',
        tableData: [],
        options: [],
        type1: '',
        type: '',
        tag_id: '',
        params: {
          tag_id: '',
          type: 'article'
        },
        params3: { // table表格数据展示
          id: '',
          token: '',
          type: '',
          table: 'faq_list'
        },
        ruleForm: {
          id: '',
          faq_type: '',
          title: '',
          content: '',
          order_nu: '',
          token: ''
        }
      }
    },
    created () { // 一进页面就执行方法
      this.getorgan()
      this.getData()
      this.params3.token = window.sessionStorage.getItem('session')
      this.ruleForm.token = window.sessionStorage.getItem('session')
    },
    methods: {
      getorgan () {
        var _this = this
        getFaqType().then(function (res) {
          console.log('all',res.data.data)
          for (var i = 0; i < res.data.data.length; i++) {
            var obj = {
              name: res.data.data[i].typ_name,
              id: res.data.data[i].typ_code
            }
            _this.options.push(obj)
          }
        }).catch(function (err) {
          console.log(err)
        })
      },
      selectRank (val) {
        this.type = val
      },
      selectRank2 (val) {
        this.tag_id = val
        this.ruleForm.faq_type = val
      },
      search () {
        this.getData()
      },
      getData () {
        var _this = this
        var _this = this
        if (this.type1 ==''){
          this.type = 'all'
        }
        getFaqList({type: this.type}).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
        }).catch(function (err) {
          console.log(err)
        })
      },
      getContent (id) {
        var _this = this;
        getFaqDetail({faq_id: id}).then(function (res) {
          console.log('res',res)
          _this.ruleForm.title = res.data.data.title
          _this.ruleForm.content = res.data.data.content
          _this.ruleForm.order_nu = res.data.data.order_nu
          if(res.data.data.faq_type == ''){
            _this.tag_id = ''
            _this.ruleForm.faq_type = 'all'
          }else{
            _this.tag_id = res.data.data.faq_type
            _this.ruleForm.faq_type = res.data.data.faq_type
          }

        }).catch(function (err) {
          console.log(err)
        })
      },
      add () {
        this.dialogFormVisible = true
        this.dialogTitle = '添加'
        this.ruleForm.id = 0
        this.ruleForm.content = ''
        this.ruleForm.title = ''
        this.ruleForm.order_nu = ''
        this.ruleForm.faq_type = ''
        this.tag_id = ''
      },
      editRow (id) {
        this.dialogFormVisible = true
        this.dialogTitle = '编辑'
        this.ruleForm.id = id
        this.getContent(id)
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
      commit () {
        var _this = this
        var reg = /^[0-9]*$/;

        if (this.ruleForm.order_nu == ''){
          this.$message({
            type: 'warning',
            message: '排序号不能为空哦'
          })
          return
        }
        if(!reg.test(this.ruleForm.order_nu)){
          this.$message({
            type: 'warning',
            message: '排序号必须是数字哦'
          })
          return
        }

        if (this.ruleForm.title == ''){
          this.$message({
            type: 'warning',
            message: '问题名称不能为空哦'
          })
          return
        }

        if (this.ruleForm.content == ''){
          this.$message({
            type: 'warning',
            message: '答案不能为空哦'
          })
          return
        }

        if (this.ruleForm.faq_type == 'all'){
          this.$message({
            type: 'warning',
            message: '请选择类型哦'
          })
          return
        }
        addEditFaq(this.ruleForm).then(function (res) {
          if (res.data.errcode == 0) {
            _this.$message({
              message: '成功',
              type: 'success'
            })
          } else {
            _this.$message({
              message: '失败',
              type: 'warning'
            })
          }
          _this.getData()
        }).catch(function (err) {
          console.log(err)
        })
        this.dialogFormVisible = false
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
