import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局的 css 文件
import '@/assets/css/global.less'
// 引入字体图标的css文件
import '../public/static/iconfont/iconfont.css'
// 引入axios
import axios from 'axios'
// 对服务器进行 socket 连接
import SocketService from '@/utils/socket_service'
SocketService.Instance.connect()
// 将 socket 挂载到 vue 原型上
Vue.prototype.$socket = SocketService.Instance

// 请求基准路径的配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到vue的原型对象上
// 在组件中使用 this.$http
Vue.prototype.$http = axios

// 将全局的echarts对象挂载到vue的原型对象上
// 在组件中使用 this.$echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
