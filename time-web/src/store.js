import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import db from './firebase'
import router from './router'
import { Timer } from './classes'

Vue.use(Vuex)

function getByID(state){
  return function(id) {
    let timer = state.timerGroups.find(v => id.startsWith(v.id))
    if (timer) return null

    while(timer != undefined || timer.id != id || timer.children.length > 0) {
      timer = timer.children.find(v => id.startsWith(v.id))
    }
    return timer
  }
}

export default new Vuex.Store({
  state: {
    userID: undefined,
    timerGroups: [],
    timerToEdit: undefined
  },
  mutations: {
    init(state) {
      setInterval(() => {
        console.log('update timeString')
        for(const timer of state.timerGroups) {
          
          timer.getTime()
          timer.updateTimeString()
          
        }
      }, 1000)
    },
    setUserID(state, id) {
      state.userID = id
      router.push('/')
    },
    setTimerGroups(state, groups) {
      state.timerGroups = groups
    },
    addGroup(state, name) {
      state.timerGroups.push(new Timer(name, [], 0))
    },
    setTimerToEdit(state, timer) {
      state.timerToEdit = timer
    },
    deleteTimer(state, timerID) {
      let timer = getByID(state)(timerID)
      if (timer == null) return
      if (timer.parent != undefined) {
        timer.parent.children = timer.parent.children.filter(v => v != timer)
      }
      else {
        state.timerGroups =  state.timerGroups.filter(v => v != timer)
      }
    }
  },
  getters: {
    getByID: getByID
  },
  actions: {
    connectUser({commit}, {mail, password}) {
      // eslint-disable-next-line
      console.log(`Logging in ${mail}`)
      firebase.auth().signInWithEmailAndPassword(mail, password)
      .then(user => {
        commit('setUserID', user.user.uid)
        
      }).catch(() => commit('setUserID', null)) 
    },
    fetchGroups({commit}) {
      const uni = new Timer('Uni', [
        new Timer('Übungszettel', [
          new Timer('MafI', [
            new Timer('ÜZ1', [], 13281),
            new Timer('ÜZ2', [], 19232)
          ])
        ])
      ])
      const kirche = new Timer('Kirche', [
        new Timer('Schmitt3', [], 12321),
        new Timer('KJK', [], 43223),
        new Timer('Frei', [], 432323)
      ])

      uni.calculateIDs('')
      kirche.calculateIDs('')

      commit('setTimerGroups', [uni, kirche])
      /* state.firebaseUserDoc.collection('groups').get().then(res => {
        let col = []
        res.forEach(element => {
          col.push(element.id)
        });
        commit('setGroups', col)
      }) */
    },

    
    createTimer({commit}, {group, name}) {
      //state.firebaseUserDoc.collection('groups').doc(group).collection('timer').doc(name).set({})
      commit('addTimerToGroup', {group, name})
    }
  }
})
