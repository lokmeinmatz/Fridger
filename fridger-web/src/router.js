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
      name: 'Login',
      component: Login,
      meta: {
        requiresNoAuth: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import ('./views/Home.vue')
    },
    {
      path: '/addFood',
      name: 'Add Food',
      component: () => import ('./views/AddFood.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = !to.matched.some(rec => rec.meta.requiresNoAuth)
  document.title = `FRIDGER ${to.name}`
  if (requiresAuth && !store.state.loggedIn) {
    next('/login')
  }
  else {
    next()
  }
})

export default router