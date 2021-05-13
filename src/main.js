import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import Resource from 'vue-resource';


import './assets/css/global.css'
import axios from 'axios'
// axios.defaults.baseURL='http://www.ysqorz.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})

import echarts from 'echarts'

Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
