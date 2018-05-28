<template>
  <div>
    <common-header :title="'订单管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'订单详情'"></common-header-tilte>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="expand" prop="goods">
          <template slot-scope="scope">
            <div class="table2">
              <h3>商品相关信息</h3>
              <el-table :data="scope.row.goods">
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="pic" label="商品图片" width="100" style="background: #ccc;">
                  <template slot-scope="props">
                    <img :src="props.row.pic" alt="" class="table_pic">
                  </template>
                </el-table-column>
                <el-table-column prop="number" label="商品数量"></el-table-column>
                <el-table-column prop="price" label="商品价格"></el-table-column>
                <el-table-column prop="pvs_name" label="规格名称"></el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="100%" ></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="total_price" label="总价格"></el-table-column>
        <el-table-column prop="creat_time" label="时间"></el-table-column>
        <el-table-column prop="simple_adress" label="地址"></el-table-column>
        <el-table-column prop="detail_adress" label="详细地址"></el-table-column>
        <el-table-column prop="user_name" label="用户名"></el-table-column>
        <el-table-column prop="total_price" label="总金额"></el-table-column>
        <el-table-column prop="total_integral" label="总金额"></el-table-column>
        <el-table-column prop="logisticCode" label="物流编号"></el-table-column>
        <el-table-column prop="shipperCode" label="物流公司编号"></el-table-column>
        <el-table-column prop="shipper_name" label="物流公司"></el-table-column>
        <el-table-column prop="pay_type" label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.pay_type == 'ali'">支付宝</span>
            <span v-if="scope.row.pay_type == 'wei'">微信</span>
            <span v-if="scope.row.pay_type == 'other'">余额</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="state" label="状态">
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
        <el-table-column prop="cancle_return" label="返回">
          <template slot-scope="scope">
            <p v-if="scope.row.cancle_return == 'cancle'">取消</p>
            <p v-if="scope.row.cancle_return == 'normal'">正常</p>
            <p v-if="scope.row.cancle_return == 'return'">退款</p>
            <p v-if="scope.row.cancle_return == 'invalid'">失效</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getOrderDesc} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      isDasabled: true,
      tableData: [],
      order_id: ''
    }
  },
  created () { // 一进页面就执行方法
    this.order_id = this.$route.query.id
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
    getData () {
      var _this = this
      this.tableData = [];
      getOrderDesc({order_id: this.order_id}).then(function (res) {
        _this.loading = false
        _this.tableData.push(res.data.data)
      }).catch(function (err) {
      })
    },
    /*    handleExpandChange(row, isExpanded) {
     row.children = 数据源;
     }*/
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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table2{
    background: #F56C6C;
    border: 1px solid #F56C6C;
    color: #fff;
    font-weight: bold;
  }
  .table2 h3{
    font-size:16px;
    padding:10px;
    letter-spacing:.1em;
  }

</style>
