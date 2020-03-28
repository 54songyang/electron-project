import Vue from 'vue'
import axios from 'axios'
import ViewUI from 'view-design';
import './assets/css/base.scss';
import 'view-design/dist/styles/iview.css';
import App from './App'
import router from './router'
import store from './store'
import utils from './assets/js/utils'
import clampy from '@clampy-js/vue-clampy';
import VueLazyload from 'vue-lazyload';

import VueAplayer from 'vue-aplayer'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(VueAplayer);
Vue.use(clampy);
Vue.use(VueLazyload);

axios.defaults.withCredentials = true// 允许跨域设置，不然可能因为拿不到cookie而报错
axios.defaults.baseURL = "http://www.request.pipicong.top/";
/*请求拦截*/
axios.interceptors.request.use(
  config => {
    if (config.meth === 'post' && !(config.data instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      config.data = qs.stringify(config.data, { arrayFormat: 'repeat' }) /*这里是，后端要求传数组的时候做的设置，以前出过错*/
    }
    return config
  }, error => {
    return Promise.reject(error)
  }
)
/* 响应拦截 */
axios.interceptors.response.use(
  res => {
    /*可在这里根据返回的状态码做一些拦截操作*/
    return res
  }, err => {
    return Promise.resolve(err)
  }
)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
