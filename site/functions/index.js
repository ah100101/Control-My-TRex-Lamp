const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.updateLamp = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://controlmytrexlamp.netlify.com')

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    res.set('Access-Control-Allow-Origin', 'https://controlmytrexlamp.netlify.com')
    
    // only update if the color is valid
    let color = 'FFF'
    if (req.query.color && /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test('#' + req.query.color)) {
      color = req.query.color 
      
      let on = true
      
      if (req.query.on === 'false' || !req.query.on) {
        on = false
      } else if (req.query.on === 'true' || req.query.on) {
        on = true
      }

      const firestore = admin.firestore()
      firestore
        .collection('lamps')
        .doc('trex')
        .set({color, on})
        .then((docRef) => {
          return res.send(200)
        })
        .catch(error => {
          console.error(error)
          return res.send(500, error)
        })
      }
  }
})
