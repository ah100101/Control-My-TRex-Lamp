const api = require('node-eufy-api')
const firebase = require('firebase')
require('dotenv').config()

var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.FIREBASE_PROJECT_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
}

firebase.initializeApp(config)
const db = firebase.firestore()

let lightState
let deviceState = {
  connected: false,
  device: undefined
}

db.collection('lamps')
  .doc('trex')
  .onSnapshot(function (doc) {
    lightState = doc.data()
    console.log(lightState)
  })

api.loadDevices(process.env.EUFY_USERNAME, process.env.EUFY_PASSWORD).then(devices => {
  // connect to device
  deviceState.device = devices.filter(d => d.deviceType === 'LIGHT_BULB')[0]

  if (deviceState.device) {
    deviceState.device.connect()
      .then(result => {
        console.log('device detected & connected')
        deviceState.connected = true
      })
      .catch(error => console.error(error))
  }
})

setInterval(function () {
  console.log(lightState)

  if (deviceState.device &&
    lightState &&
    deviceState.connected &&
    deviceState.device.isConnected()) {

    if (lightState.on && !deviceState.device.isPowerOn()) {
      deviceState.device.setPowerOn(true)
        .then(() => {
          console.log('light turned on')
          lightState.on = true
          deviceState.device.loadCurrentState()
        })
        .catch(error => console.error(error))
    } else if (!lightState.on && deviceState.device.isPowerOn()) {
      deviceState.device.setPowerOn(false)
        .then(() => {
          console.log('light turned off')
          lightState.on = false
          deviceState.device.loadCurrentState()
        })
        .catch(error => console.error(error))
    }
  } else {
    console.error('device is not connected')
  }
}, 6000)
