import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/resize.css';
import vueAxios from 'vue-axios';
import http from './utils/http';
import axios from 'axios';


Vue.use(ElementUI);

Vue.use(vueAxios, http);

Vue.prototype.$axios = axios;

Vue.config.productionTip = false
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
