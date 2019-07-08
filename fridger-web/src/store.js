import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import cookies from 'js-cookie'

import {modKnownProducts, knownProductsPaths} from './storeModules/knownProducts'
import {modStoredProducts} from './storeModules/storedProducts'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    knownProducts: modKnownProducts,
    storedProducts: modStoredProducts
  },
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
      if(cookies.get('fridger-id') != undefined) {
        commit('setLoggedIn', true)
      }

      commit(knownProductsPaths.mutations.G_FILL_DEMO)
    },
    connectUser({commit}, {uname, password}) {

      return new Promise((resolve, reject) => {
        // simulate login
        setTimeout(() => {
          cookies.set('fridger-id', '123', {expires: Date.now() + 1000 * 3600})
          commit('setLoggedIn', true)
          router.push('/')
          resolve()
        }, 1000)
      })
    }
  }
})
