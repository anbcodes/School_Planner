import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Database from './plugins/database'
Vue.config.productionTip = false
Vue.prototype.$db = new Database()
Vue.prototype.$bus = new Vue()
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
