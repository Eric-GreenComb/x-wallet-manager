// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
// axios.defaluts.withCredentials = true
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css'

/*// 百度编辑器的相关配置
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'*/

Vue.use(ElementUI, VueQuillEditor, axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  // mode: 'history',
  el: '#app',
  router,
  render: h => h(App),
  template: '<App/>',
  components: { App }

})
