<template>
  <div>
    <common-header :title="'商品列表'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'规格列表'"></common-header-tilte>
      <div class="header_search" style="text-align: left;">
        <el-button type="primary" class="search-btn" @click="add()">添加</el-button>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="name" label="名 称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button style="margin: 0px 5px 5px" @click="editRow(scope.row.id)" type="primary" size="mini"> 编辑 </el-button>
            <el-button style="margin: 0px 5px 5px" @click="lookRowScore(scope.row.id, scope.row.name)" type="primary" size="mini"> 查看</el-button>
            <el-button style="margin: 0px 5px 5px" @click="delRow(scope.row.id)" type="danger" size="mini"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form style="" :model="ruleForm"  ref="ruleForm" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="名 称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称" auto-complete="off" clearable></el-input>
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
  import {getGoodsSize, addGoodsSize, getDetailSize, deleteCommonWithType} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2
    },
    data () {
      return {
        loading: true,
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dialogTitle: '',
        tableData: [],
        params: {
          id: '',
          super_id: 0
        },
        ruleForm: {// 编辑的弹框展示
          super_id: 0,  // 一级
          id: 0,    // 0  新建否则编辑
          name: '',
          token: '',
          goods_id: ''
        },
        params3: { // table表格数据展示
          id: '',
          token: '',
          table: 'goods_leave'
        }
      }
    },
    created () { // 一进页面就执行方法
      this.params.id = this.$route.query.id
      this.ruleForm.token = window.sessionStorage.getItem('session')
      this.params3.token = window.sessionStorage.getItem('session')
      this.ruleForm.goods_id = this.$route.query.id
      this.getData()
    },
    methods: {
      handleSizeChange (val) {
        this.params.page_size = val
        this.getData()
      },
      handleCurrentChange (val) {
        this.params.start = val
        this.getData()
      },
      lookRowScore (id, name) {
        this.$router.push({name: 'sizeContent', query: {title: '查看规格_' + name, id3: this.params.id,id2: id}})
      },
      add () {
        this.dialogFormVisible = true
        this.dialogTitle = '添加'
        this.ruleForm.id = 0
        this.ruleForm.name = ''
      },
      editRow (id) {
        this.dialogFormVisible = true
        this.dialogTitle = '编辑'
        this.ruleForm.id = id
        this.getContent(id)
      },
      getContent (id) {
        var _this = this;
        getDetailSize({type: 0, id: id}).then(function (res) {
          _this.ruleForm.name = res.data.data.name
        }).catch(function (err) {
          console.log(err)
        })
      },
      delRow (id) {
        var _this = this;
        this.$confirm('是否删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getData () {
        var _this = this
        getGoodsSize(this.params).then(function (res) {
          _this.loading = false
          _this.tableData = res.data.data
        }).catch(function (err) {
           console.log(err)
        })
      },
      search () {
        this.getData()
      },
      commit () {
        var _this = this
        if (this.ruleForm.name == ''){
          _this.$message({
            message: '名称不能为空哦',
            type: 'warning'
          })
          return
        }
        addGoodsSize(this.ruleForm).then(function (res) {
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
    },
    beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      to.meta.keepAlive = true; // 让 A 缓存，即不刷新
      next();
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
