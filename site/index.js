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
      this.lightOn = !this.lightOn
      this.makeUpdate()
    },
    makeUpdate: function () {
      console.log('new url')
      console.log(this.url)
      fetch(this.url)
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
    },
    url: function () {
      return `https://us-central1-control-my-trex-lamp-f1a1e.cloudfunctions.net/updateLamp?on=${this.lightOn}&color=${this.color}`
    }
  }
})
