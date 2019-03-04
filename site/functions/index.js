const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.updateLamp = functions.https.onRequest((req, res) => {
  // verify color being passed in is a valid value
  // const original = req.query.color
  // const on = req.query.on

  const firestore = admin.firestore()
  firestore
    .collection('lamps')
    .doc('trex')
    .set({
      color: '#FFF',
      on: true
    })
    .then((docRef) => {
      return res.send(200, 'T-Rex is Awake')
    })
    .catch(error => {
      console.error(error)
      return res.send(500, error)
    })
})
