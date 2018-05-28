<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'权限管理'"></common-header-tilte>
      <div class="header_search">

      </div>
      <div style="margin-top: 150px;">

      </div>
    </div>
  </div>
</template>
<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
// import {getUserList, lookUser, editUser, instructList, professionList} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }

</style>
