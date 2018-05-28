<template>
  <div>
    <common-header :title="'提现管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'提现列表'"></common-header-tilte>
      <div class="header_search" style="padding-top: 20px;text-align: left">
        <el-form ref="params" :model="params" :inline="true" >
          <el-form-item label="">
            <el-input v-model="params.keyword" placeholder="请输入手机号" clearable @keyup.enter="search()"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="handel_type" placeholder="请选择状态" style="width: 100%;" @change="selectRank($event)">
              <el-option label="未处理" value="handing"></el-option>
              <el-option label="成功" value="success"></el-option>
              <el-option label="失败" value="fail"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: 20px">
           <el-select v-model="car_type" placeholder="请选择体现方式" @change="selectRank2($event)">
             <el-option label="银行卡" value="card"></el-option>
             <el-option label="支付宝" value="ali"></el-option>
           </el-select>
         </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="exportExcel()">导出excel</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="ic_name" label="账号姓名"></el-table-column>
        <el-table-column prop="ic_number" label="账号" min-width="150"></el-table-column>
        <el-table-column prop="mobile" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="type" label="提现方式">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='ali'">支付宝</span>
            <span v-if="scope.row.type=='card'">银行卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="bank_name" label="提现银行"></el-table-column>
        <el-table-column prop="money" label="金额"></el-table-column>
        <el-table-column prop="creat_time" label="时间" min-width="180"></el-table-column>
        <el-table-column prop="state" label="提现状态">
          <template slot-scope="scope">
            <p v-if="scope.row.state == 'handing'">未处理</p>
            <p v-if="scope.row.state == 'success'">成功</p>
            <p v-if="scope.row.state == 'fail'">失败</p>
          </template>
        </el-table-column>
        <!--<el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="success" size="small" v-if="scope.row.state=='handing'" @click="handleEdit(scope.row.id,'y')">处理中</el-button>
            <el-button type="danger" size="small" v-if="scope.row.state=='handed'" @click="handleEdit(scope.row.id,'n')">已处理</el-button>
          </template>
        </el-table-column>-->
        <!--<el-table-column label="操作" min-width="100">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="handleEdit(scope.row._id)" type="primary" size="mini"> 已处理/未处理</el-button>
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

      <!--编辑-->
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
        <el-form style="" label-position="right" label-width="100px" class="demo-ruleForm">
          <el-form-item label="提现途径：">
            <el-select  v-model="path_type" clearable placeholder="请选择提现途径" style="width: 90%;" @change="sele2($event)">
              <el-option label="支付宝" value="ali"></el-option>
              <el-option label="银行卡" value="card"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择状态：">
            <el-select  v-model="state_type" clearable placeholder="请选择状态" style="width: 90%;" @change="sele1($event)">
              <el-option label="未处理" value="handing"></el-option>
              <el-option label="成功" value="success"></el-option>
              <el-option label="失败" value="fail"></el-option>
            </el-select>
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
  /* eslint-disable spaced-comment */

import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getallWithdrawcash, export_withdraw_cash} from '../../api/index'
import config from '../../api/config'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data: function () {
    return {
      loading: true,
      total: 0,
      handel_type: '',
      car_type: '',
      state_type: '',
      path_type: '',
      params: {
        handel_type: 'all',
        car_type: 'all',
        keyword: '',
        page: 1,
        number: 10
      },
      tableData: [],
      currentPage1: 1,
      total_count: 0,
      dialogTitle: '导出Excel',
      dialogFormVisible: false,
      params2: {
        type: '',
        state: ''
      }
    }
  },
  created () { // 一进页面就执行方法
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
    handleCurrentChange (val) {
      this.params.page = val
      this.getData()
    },
    selectRank (val) {
      console.log('val',val)
      if (val == '') {
        this.params.handel_type = 'all'
      } else {
        this.params.handel_type = val
      }
    },
    selectRank2 (val) {
      if (val == '') {
        this.params.car_type = 'all'
      } else {
        this.params.car_type = val
      }
    },
    sele2 (val) {
      if (val == '') {
        this.params2.type = 'all'
      } else {
        this.params2.type = val
      }
    },
    sele1 (val) {
      if (val == '') {
        this.params2.state = 'all'
      } else {
        this.params2.state = val
      }
    },
    search () {
      this.params.page = 1
      this.handleCurrentChange (1)
      this.getData()
    },
    /*handleEdit (id, is_handle) {
      var _this = this
      this.$confirm('确定进行此操作吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // handle_withdrawcash({'id': id, 'is_handle': is_handle}).then(function (res) {
        //   console.log(res)
        //   if (res.data.errcode == 0) {
        //     _this.$message({
        //       showClose: true,
        //       message: '修改成功',
        //       type: 'success'
        //     })
        //     _this.getData()
        //   } else {
        //     _this.$message({
        //       showClose: true,
        //       message: '修改失败',
        //       type: 'error'
        //     })
        //   }
        // }).catch(function (err) {
        //   console.log(err)
        // })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },*/
    getData () {
      var _this = this;
      getallWithdrawcash(_this.params).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data.data
        _this.total_count = parseInt(res.data.data.count)
        setTimeout(function () {
         _this.loading = false
        }, 200)
        }).catch(function (err) {
        console.log(err)
      })
    },
    exportExcel () {
      this.dialogFormVisible = true
    },
    commit(){

      if (this.path_type == ''){
        this.$message({
          showClose: true,
          message: '请选择提现途径',
          type: 'success'
        })
        return;
      }

      if (this.state_type == ''){
        this.$message({
          showClose: true,
          message: '选择状态',
          type: 'success'
        })
        return;
      }

      var _this = this;
      export_withdraw_cash(this.params2).then(function (res) {
        location.href = config.export_withdraw_cash
        _this.$message({
          showClose: true,
          message: '导出成功',
          type: 'success'
        })
        _this.dialogFormVisible = false
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

</style>
