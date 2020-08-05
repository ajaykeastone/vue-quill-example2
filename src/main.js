// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Editor from './components/Editor'
import router from './router'

Vue.config.productionTip = false
Vue.component('editor', require('./components/Editor'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { Editor },
  template: '<Editor/>'
})
