import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import cookies from 'js-cookie'

import {modKnownProducts, knownProductsPaths} from './storeModules/knownProducts'
import {modStoredProducts, storedProductsPaths} from './storeModules/storedProducts'

Vue.use(Vuex)


const store = new Vuex.Store({
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
    init({commit, dispatch}) {
      if(cookies.get('fid') != undefined) {
        commit('setLoggedIn', true)
      }

      commit(knownProductsPaths.mutations.G_FILL_DEMO)
      dispatch(storedProductsPaths.actions.G_FILL_DEMO)
    },
    connectUser({commit}, {uname, password}) {

      return new Promise((resolve, reject) => {
        // simulate login
        setTimeout(() => {
          cookies.set('fid', '123', {expires: 7})
          commit('setLoggedIn', true)
          router.push('/')
          resolve()
        }, 1000)
      })
    }
  }
})

export default store

store.dispatch('init')