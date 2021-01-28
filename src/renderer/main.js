import Vue from 'vue'
import axios from './axios/index'
import ViewUI from 'view-design';
import './assets/scss/base.scss';
import 'view-design/dist/styles/iview.css';
import App from './App'
import router from './router/index.js';
import store from './store'
import utils from './assets/js/utils'
import clampy from '@clampy-js/vue-clampy';
import VueLazyload from 'vue-lazyload';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

Vue.prototype.$axios = axios
Vue.prototype.$utils = utils
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.use(clampy);
Vue.use(VueLazyload);

/* eslint-disable no-new */
new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')