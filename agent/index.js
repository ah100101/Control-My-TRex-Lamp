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

    if (deviceState.device &&
      lightState &&
      deviceState.connected &&
      deviceState.device.isConnected()) {

      if (lightState.color) {
        setColor(hexToRgb('#' + lightState.color))
          .then(result => {
            // check if power on / off
            if (lightState.on && !deviceState.device.isPowerOn()) {
              return turnOn()
                .then(() => {
                  console.log('light turned on')
                  lightState.on = true
                  return deviceState.device.loadCurrentState()
                })
            } else if (!lightState.on && deviceState.device.isPowerOn()) {
              return turnOff()
                .then(() => {
                  console.log('light turned off')
                  lightState.on = false
                  return deviceState.device.loadCurrentState()
                })
            }
          })
          .catch(error => console.error(error))
      }
    } else {
      console.error('device is not connected')
    }
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
  
}, 6000)

function turnOn () {
  let rgb = deviceState.device.getRgbColors()
  return deviceState.device.setState({ power: true, brightness: 1, colors: { red: rgb.r, green: rgb.g, blue: rgb.b } })
}

function turnOff () {
  let rgb = deviceState.device.getRgbColors()
  return deviceState.device.setState({ power: false, brightness: 1, colors: { red: rgb.r, green: rgb.g, blue: rgb.b } })
}

function setColor(rgb) {
  console.log(rgb)
  return deviceState.device.setState({ brightness: 1, colors: { red: rgb.r, green: rgb.g, blue: rgb.b } })
}

function def(value) {
  return value !== undefined
}

function hexToRgb (hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
