<template>
  <div>
    <common-header :title="'用户管理'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'权限管理'"></common-header-tilte>
      <div style="margin-top: 150px;">
       <!-- <el-checkbox-group v-model="checkList" @change="handleCheckedList">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group>-->
      </div>
    </div>
  </div>
</template>
<script>
import Header from '../common/common_header.vue'
import Header2 from '../common/common_headerTitle.vue'
import {get_authority_list} from '../../api/index'
export default {
  components: {
    'common-header': Header,
    'common-header-tilte': Header2
  },
  data () {
    return {
     /* checkList:['上海', '北京', '广州', '深圳']*/
    }
  },
  created () {

  },
  methods: {
    /*handleCheckedList (val) {
      console.log('val', val)
    }*/
  }
}
</script>
<style scoped>
  .el-input,.el-select{
    width:90%;
  }

</style>
