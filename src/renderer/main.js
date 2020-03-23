import Vue from 'vue'
import axios from 'axios'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import App from './App'
import router from './router'
import store from './store'
import utils from './assets/js/utils'

import VueAplayer from 'vue-aplayer'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(VueAplayer);

axios.defaults.baseURL = "http://www.request.pipicong.top/";

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
