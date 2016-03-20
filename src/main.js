import Vue from 'vue'
import app from './app.vue'
import VueRouter from 'vue-router'

import './styles.css'

Vue.config.debug = process.env.NODE_ENV !== 'production'

Vue.use(VueRouter)
Vue.use(require('vue-resource'))

const router = new VueRouter({
  hashbang: false
})
const App = Vue.extend(app)

router.start(App, 'body')
