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
      name: 'Produkte hinzufügen',
      component: () => import ('./views/AddFood.vue'),
      props: (route) => ({ enter_mode: route.query.enter_mode })
    },
    {
      path: '/productTemplates',
      name: 'Bekannte Produkte',
      component: () => import ('./views/KnownFood.vue')
    },
    {
      path: '/storedProducts',
      name: 'Vorhandene Produkte',
      component: () => import ('./views/StoredFood.vue')
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