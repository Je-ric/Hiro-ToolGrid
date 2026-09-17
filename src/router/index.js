import { createRouter, createWebHashHistory } from 'vue-router'
import { tools } from '../data/tools.js'
import HomeView from '../views/HomeView.vue'

const toolRoutes = tools.map(t => ({
  path: t.path,
  component: t.component,
  meta: { title: t.name },
}))

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: HomeView },
    ...toolRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.afterEach(to => { document.title = to.meta.title ? `${to.meta.title} | ToolGrid` : 'ToolGrid | Your everyday toolbox' })
export default router
