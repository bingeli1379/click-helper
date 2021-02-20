import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Macro from '../views/Macro.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/macro',
    name: 'Macro',
    component: Macro
  }
]

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
