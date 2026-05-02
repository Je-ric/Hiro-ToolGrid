import { createRouter, createWebHashHistory } from 'vue-router'
import { tools } from '../data/tools.js'
import HomeView from '../views/HomeView.vue'

const toolRoutes = tools.map(t => ({
  path: t.path,
  component: t.component,
}))

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomeView },
    ...toolRoutes,
  ],
})
