import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    userID: undefined
  },
  mutations: {
    init(state) {
      
    },
    setUserID(state, uid) {
      state.userID = uid
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.userID != undefined
    }
  },
  actions: {
    connectUser({commit}, {uname, password}) {

      return new Promise((resolve, reject) => {
        // simulate login
        setTimeout(() => {
          commit('setUserID', 123)
          router.push('/')
          resolve()
        }, 1000)
      })
    }
  }
})
