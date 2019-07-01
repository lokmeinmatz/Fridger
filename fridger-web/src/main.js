import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import VueQuagga from 'vue-quaggajs'

// register component 'v-quagga'
Vue.use(VueQuagga)

Vue.config.productionTip = false


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
