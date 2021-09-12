// Import npm libraries
const request = require('postman-request');

const accessKey = '2cfb220feffc136cfeded7206f438228'
const units = 'm'

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${latitude},${longitude}&units=${units}`

  request({ url, json: true }, (error, { body } = {}) => {
    
    if (error) {
      callback('Unable to connect to weather service', undefined)
    } else if (body.error) {
      callback('Unable to find location', undefined)
    } else {
      callback(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`)
    }
  })
}

module.exports = forecast