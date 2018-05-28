<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="this.name+'_网关列表'"></common-header-tilte>
      <el-table :data="tableData" max-height="450" style="width: 100%;" border v-loading="loading">
        <el-table-column type="index" label="#" width="100%"></el-table-column>
        <el-table-column prop="nick_name" label="昵称" min-width="200"></el-table-column>
        <el-table-column prop="head_pic" label="头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.head_pic" class="table_pic"/>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="用户类型">
          <template slot-scope="scope">
            <p v-if="scope.row.state == 'new'">新人</p>
            <p v-if="scope.row.state == 'normal'">正常</p>
            <p v-if="scope.row.state == 'sleep'">休眠</p>
            <p v-if="scope.row.state == 'invalid'">无效</p>
            <p v-if="scope.row.state == 'friend'">伙伴</p>
            <p v-if="scope.row.state == 'incentive'">待激励</p>
          </template>
        </el-table-column>
        <el-table-column prop="is_vip" label="是否为会员">
          <template slot-scope="scope">
            <p v-if="scope.row.is_vip == '1'">是</p>
            <p v-if="scope.row.is_vip == '0'">否</p>
          </template>
        </el-table-column>
        <el-table-column prop="vip_rank" label="会员等级"></el-table-column>
       <!-- <el-table-column label="操作" min-width="300">
          <template slot-scope="scope" >
            &lt;!&ndash;<el-button style="margin: 0px 5px 5px" @click="lookRowScore(scope.row._id)" type="primary" size="mini"> 查看</el-button>&ndash;&gt;
          </template>
        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>
<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {getFrontPerson} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
      loading: true,
      tableData: [],
      name: '',
      user_id: ''
    }
  },
  created () { // 一进页面就执行方法
    this.user_id = this.$route.query.id
    this.name = this.$route.query.name
    this.getData()
  },
  methods: {
    getData () {
      var _this = this
      getFrontPerson({user_id:this.user_id}).then(function (res) {
        _this.loading = false
        _this.tableData = res.data.data
      }).catch(function (err) {
      })
    },
    search () {
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
