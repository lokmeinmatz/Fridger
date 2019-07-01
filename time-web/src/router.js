import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import firebase from 'firebase'

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
  const currUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(rec => rec.meta.requiresAuth)

  if (requiresAuth && !currUser) {
    next('/login')
  }
  else {
    next()
  }
})

export default router