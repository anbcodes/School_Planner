import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Database from './plugins/database'
import DayHandler from './plugins/dayHandler';
Vue.config.productionTip = false
Vue.prototype.$db = new Database()
Vue.prototype.$bus = new Vue()
Vue.prototype.$dayHandler = new DayHandler()
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
