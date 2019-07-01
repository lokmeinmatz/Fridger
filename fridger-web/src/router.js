import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: () => import ('./views/Home.vue'),
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(rec => rec.meta.requiresAuth)

  if (requiresAuth && !store.getters.isLoggedIn) {
    next('/login')
  }
  else {
    next()
  }
})

export default router