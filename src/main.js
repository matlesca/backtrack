import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import app from './components/app.vue'

import './styles.css'

Vue.config.debug = process.env.NODE_ENV !== 'production'

Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
  hashbang: false
})
const App = Vue.extend(app)

router.start(App, 'body')
