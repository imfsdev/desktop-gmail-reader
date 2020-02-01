import Vue from 'vue'

import App from './App'
import store from './store'

import './plugins/buefy'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
