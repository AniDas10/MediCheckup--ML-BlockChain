

module.exports = {
   "server": {
      "baseDir": ["./src", "./build/contracts"],
      "middleware": {
        1: require('connect-cors')({
          origins: ['*']
        })
      },
      "cors":true
   }
}
