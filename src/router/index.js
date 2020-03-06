import Vue from 'vue'
import VueRouter from 'vue-router'
import Panel from '../views/Panel.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Panel',
    component: Panel
  }
]

const router = new VueRouter({
  routes
})

export default router
