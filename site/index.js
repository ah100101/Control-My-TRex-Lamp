var app = new Vue({
  el: '#app',
  data: {
    lightOn: false
  },
  computed: {
    status: function () {
      if (this.lightOn) {
        return 'On'
      } else {
        return 'Off'
      }
    }
  }
})
