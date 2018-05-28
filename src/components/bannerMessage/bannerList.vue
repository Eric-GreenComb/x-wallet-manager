<template>
  <div>
    <common-header :title="'数据统计'"></common-header>
    <div class="page-content">
      <common-header-tilte :title2="'用户积分概况图'"></common-header-tilte>
        <!--饼状图区域-->
        <schart :canvasId="canvasId"
                :type="type"
                :width="width"
                :height="height"
                :data="data"
                :options="options"
                class="pie"
        >
          <!--这里是扇形图的区域-->
        </schart>
    </div>
  </div>
</template>
<script>
  /* eslint-disable indent */
  import  Schart from 'vue-schart';
  import Header from '../common/common_header.vue'
  import Header2 from '../common/common_headerTitle.vue'
  import {userCount,tokenCount,transCount,transSum} from '../../api/index'
  export default {
    components: {
      'common-header': Header,
      'common-header-tilte': Header2,
       Schart
    },
    data() {
      return {
        canvasId: 'myChart',
        type: 'ring',
        width: 1000,
        height: 800,
        data: [],
        options: {
          title: '',
          bgColor: 'lightgray',
          titleColor: '#ffffff',
          legendColor: '#ffffff',
          radius: 150,                     // 环形图外圆半径
        }
      }
    },
    created () { // 一进页面就执行方法
      this.getData()
      // enter键快捷搜索
      var _this = this
      this.data =[]
    },
    methods: {
      getData () {
        var _this = this
        //获取用户数量
        userCount().then(function (res) {
          //console.log(res)
          if(res.data.errcode == 0){
            var obj = {name: '用户总数', value: 1}
          obj.value = res.data.msg;   //用户的数量 27人
            _this.data.push(obj)
          }
        }).catch(function (err) {
          console.log(err)
        })
        //获取积分数量
        tokenCount().then(function (res) {
          //console.log(res)
          if(res.data.errcode == 0){
            var obj = {name: '积分总数', value: 1}
            obj.value = res.data.msg;  //积分总数 13
            _this.data.push(obj)
          }
        }).catch(function (err) {
          console.log(err)
        })
        //获取总交易量
        transCount().then(function (res) {
          //console.log(res)
          if(res.data.errcode == 0){
            var obj = {name: '交易总量', value: 1}
            obj.value = res.data.msg;   //交易总量 0  真实数据
            obj.value = 10;   //   mock数据
            _this.data.push(obj)
          }
        }).catch(function (err) {
          console.log(err)
        })
        //获取交易总额
        transSum().then(function (res) {
         // console.log(res)
          if(res.data.errcode == 0){
            var obj = {name: '交易总额', value: 1}
            obj.value = res.data.msg; //交易总额 0 真实数据
            obj.value = 30;   //  mock数据
            _this.data.push(obj)
          }else{
            
          }
        }).catch(function (err) {
          console.log(err)
        })
      },

    }
  }
</script>
<style scoped>
.pie{
  width:1100px;
  height: 500px;
}

</style>
