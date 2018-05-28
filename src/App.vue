<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
      </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import "style/my.css";
  @import "assets/icon/iconfont.css";
  *{
    margin:0;
    padding:0;
    box-sizing: border-box;
  }
  .el-menu{
    border-right:transparent;
  }
.self-table h4{
  text-align: left;
}

</style>
