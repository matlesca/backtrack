import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import app from './components/app.vue'
import play from './components/play.vue'
import landing from './components/landing.vue'
import {isAuth} from './vuex/dz_actions'

import './styles.css'

Vue.config.debug = process.env.NODE_ENV !== 'production'

Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
    hashbang: false
})

router.map({
    '': {
        component: landing
    },
    '/play': {
        component: play,
        auth: true
    },
    '/example': {
        component: play
    }
})

router.beforeEach(function (transition) {
  if (transition.to.auth === true) {
    return isAuth()
  } else {
    transition.next()
  }
})

router.start(app, 'body')
