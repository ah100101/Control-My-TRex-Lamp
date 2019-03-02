const api = require('node-eufy-api')
require('dotenv').config()

console.log(process.env.EUFY_USERNAME)
console.log(process.env.EUFY_PASSWORD)

api.loadDevices(process.env.EUFY_USERNAME, process.env.EUFY_PASSWORD).then(devices => {
  devices.filter(d => d.deviceType === 'LIGHT_BULB')[0].connect()
  
  // console.log(details)
  // if (details) {
  //   let lb = api.createDevice(api.Model.T1011, details.code, details.ipAddress)
  //   if (lb) {
  //     lb.connect()
  //       .then(result => {
  //         console.log('device connected')
  //       })
  //       .catch(error => {
  //         console.error(error)
  //       })
  //   }
  // }
})

// setInterval(function () { 
//   console.log("sup") 
// }, 3000)