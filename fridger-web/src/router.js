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
      component: () => import ('./views/AddFood.vue'),
      props: (route) => ({ enter_mode: route.query.enter_mode })
    },
    {
      path: '/productTemplates',
      name: 'Known Products',
      component: () => import ('./views/KnownFood.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const requiresAuth = !to.matched.some(rec => rec.meta.requiresNoAuth)
  if (requiresAuth && !store.state.loggedIn) {
    next('/login')
  }
  else {
    document.title = `FRIDGER ${to.name}`
    next()
  }
})

export default router