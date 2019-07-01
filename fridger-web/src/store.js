import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import cookies from 'js-cookie'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggedIn(state, b) {
      state.loggedIn = b
    }
  },
  getters: {
  },
  actions: {
    init({commit}) {
      if(cookies.get('id') != undefined) {
        commit('setLoggedIn', true)
        router.push('/')
      }
    },
    connectUser({commit}, {uname, password}) {

      return new Promise((resolve, reject) => {
        // simulate login
        setTimeout(() => {
          commit('setLoggedIn', true)
          router.push('/')
          resolve()
        }, 1000)
      })
    }
  }
})
