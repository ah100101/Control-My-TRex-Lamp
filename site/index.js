const firebase = require('firebase/app')
require('firebase/firestore')

var config = {
  apiKey: 'AIzaSyD3wKt5uQPJeCi4nS9XlgtXpiFNjSLl8lQ',
  authDomain: 'control-my-trex-lamp-f1a1e.firebaseapp.com',
  databaseURL: 'https://control-my-trex-lamp-f1a1e.firebaseio.com',
  projectId: 'control-my-trex-lamp-f1a1e',
  storageBucket: 'control-my-trex-lamp-f1a1e.appspot.com',
  messagingSenderId: '861573862603'
}

firebase.initializeApp(config)
const db = firebase.firestore()

var app = new Vue({
  el: '#app',
  data: {
    lightOn: false,
    // locked: false,
    color: ''
  },
  mounted: function () {
    let state = this
    db.collection('lamps')
      .doc('trex')
      .onSnapshot(function (doc) {
        let lamp = doc.data()
        state.lightOn = lamp.on
        // state.locked = lamp.locked
        state.color = lamp.color
      })
  },
  methods: {
    flipSwitch: function () {
      // this.lightOn = !this.lightOn
      this.makeUpdate(!this.lightOn)
    },
    makeUpdate: function (onOrOff) {
      console.log('new url')
      let url = `https://us-central1-control-my-trex-lamp-f1a1e.cloudfunctions.net/updateLamp?on=${onOrOff}&color=${this.color}`
      console.log(url)
      fetch(url)
        .then(response => console.log(response))
        .catch(error => console.error(error))
    }
  },
  computed: {
    action: function () {
      if (this.lightOn) {
        return 'Off'
      } else {
        return 'On'
      }
    }
  }
})
