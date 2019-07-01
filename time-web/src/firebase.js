import firebase from 'firebase'
import 'firebase/firestore'
import store from '@/store'

const firebaseConfig = {
    apiKey: "AIzaSyAn25x-gpS8U2noMwFTMQIonUqVvIgDTvY",
    authDomain: "time-3e03f.firebaseapp.com",
    databaseURL: "https://time-3e03f.firebaseio.com",
    projectId: "time-3e03f",
    storageBucket: "time-3e03f.appspot.com",
    messagingSenderId: "840438088523",
    appId: "1:840438088523:web:ca50c9125e3a9734"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

const db = firebase.firestore()

firebase.auth().onAuthStateChanged(user => {
    if (user != null) {
        //let _userCollection = db.collection('users').doc(firebase.auth().currentUser.uid)
        //store.commit('setUserDoc', userCollection)
        store.commit('setUserID', user.uid)
    }
})

export default db