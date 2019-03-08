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
    // check if power on / off
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

    if (lightState.color) {
      // check if change color
      let currentHexValue = rgbToHex(deviceState.device.getRgbColors())

      if (lightState.color !== currentHexValue) {
        let rgb = hexToRgb(lightState.color)

        console.log('Changing color:')
        console.log(rgb)

        if (rgb && rgb.r && rgb.g && rgb.b) {
          deviceState.device.setRgbColors(rgb.g, rgb.g, rgb.b)
            .then(newColors => {
              console.log('The color is now:', newColors)
              deviceState.device.loadCurrentState()
            })
            .catch(error => console.error(error))
        }
      }
    }
  } else {
    console.error('device is not connected')
  }
}, 6000)

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

function componentToHex (c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex (r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
