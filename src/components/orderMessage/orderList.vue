<template>
  <div>
    <common-header :title="'订单管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'订单列表'"></common-header-tilte>
      <div class="header_search">
        <el-row>
          <el-col :span="5">
            <el-input v-model="params.keyword" placeholder="订单编号搜索" clearable @keyup.enter="search()" ></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-select v-model="occupation" clearable placeholder="会员" style="width: 100%;" @change="selectRank($event)">
              <el-option
                v-for="item in options"
                :key="item.occupation"
                :label="item.label"
                :value="item.occupation">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" :offset="1" style="text-align: left;">
            <el-button type="primary" class="search-btn" @click="search()">搜索</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="total_price" label="实际价格"></el-table-column>
        <el-table-column prop="state" label="会员">
          <template slot-scope="scope">
            <p v-if="scope.row.state == 'confirming'">待邀请</p>
            <p v-if="scope.row.state == 'paying'">待支付</p>
            <p v-if="scope.row.state == 'payed'">待发货</p>
            <p v-if="scope.row.state == 'dispatch'">已发货</p>
            <p v-if="scope.row.state == 'returning'">退款</p>
            <p v-if="scope.row.state == 'commenting'">待评价</p>
            <p v-if="scope.row.state == 'completed'">完成</p>
          </template>
        </el-table-column>
        <el-table-column prop="cancle_return" label="状态">
          <template slot-scope="scope">
            <p v-if="scope.row.cancle_return == 'cancle'">取消</p>
            <p v-if="scope.row.cancle_return == 'normal'">正常</p>
            <p v-if="scope.row.cancle_return == 'return'">退款</p>
            <p v-if="scope.row.cancle_return == 'invalid'">失效</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope" >
            <el-button style="margin: 0px 5px 5px" @click="lookOrderScore(scope.row.id)" type="primary" size="mini"> 订单详情</el-button>
            <!--<el-button style="margin: 0px 5px 5px" @click="lookRowMoney(scope.row.id,scope.row.name)" type="primary" size="mini">奖金记录</el-button>-->
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
import {getOrderList} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      isDasabled: true,
      options: [
        {
          occupation: 'confirming',
          label: '待邀请'
        },
        {
          occupation: 'paying',
          label: '待支付'
        },
        {
          occupation: 'payed',
          label: '待发货'
        },
        {
          occupation: 'dispatch',
          label: '已发货'
        },
        {
          occupation: 'returning',
          label: '退款'
        },
        {
          occupation: 'commenting',
          label: '待评价'
        },
        {
          occupation: 'completed',
          label: '完成'
        }
      ],
      occupation: '',
      tableData: [],
      currentPage1: 1,
      total_count: 0,
      params: {
        keyword: '',
        page: 1,
        number: 10,
        state: 'all',
        vip_rank: '10'
      },
      ruleForm: {// 编辑的弹框展示
        name: '',
        sex: '',
        mobile: '',
        money: '',
        score: '',
        jibie: ''
      },
      params3: { // table表格数据展示
        id: '',
        token: ''
      },
      ruleForm2: {// 编辑的弹框提交修改
        name: '',
        sex: '',
        mobile: '',
        money: '',
        score: '',
        jibie: ''
      },
      rules: {// 验证规则
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        mobile: [
          { required: true }
        ],
        money: [
          { required: true, message: '请输入奖金', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请输入积分', trigger: 'blur' }
        ],
        jibie: [
          { required: true, message: '请输入级别', trigger: 'blur' }
        ]
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
    lookOrderScore (id) {
//      this.$router.push({name: 'scoreList', query: {name: name,id: id}})
      const {href} = this.$router.resolve({
        name: 'orderDesc',
        query: {
          id: id
        }
      })
      window.open(href, '_blank')
    },
    lookRowBuy (index, row) {
      this.$router.push('/buyList')
    },
    lookRowMoney (id, name) {
      const {href} = this.$router.resolve({
        name: 'moneyList',
        query: {
          name: name,
          id: id
        }
      })
      window.open(href, '_blank')
    },
    lookRowAddress (index, row) {
      this.$router.push('/addressList')
    },
    lookRowFriends (index, row) {
      this.$router.push('/friendsList')
    },
    getData () {
      var _this = this
      getOrderList(this.params).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data.data
        _this.total_count = parseInt(res.data.data.count)
      }).catch(function (err) {
      })
    },
    selectRank (val) {
      console.log('val',val)
      if (val == '') {
        this.params.state = 'all'
      } else {
        this.params.state = val
      }
    },
    search () {
      this.params.page = 1
      this.handleCurrentChange (1)
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
