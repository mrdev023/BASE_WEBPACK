const data = require('../data/key_data.json')

module.exports = function (key) {
  return data[key]
}
