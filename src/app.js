// Import core modules and libraries
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Express function setup
const app = express()

// Define paths for Express and Handlebars config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set handlebars engine, views, and partials locations
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Route for homepage - dynamic
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Brian Lavery'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Brian Lavery'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'This is the help page. Send a message for help',
    title: 'Help',
    name: 'Brian Lavery'
  })
})

app.get('/weather', (req, res) => {
  const address = req.query.address
  
  if (!address) {
    return res.send({
      error: 'Ýou must provide an address.'
    })
  }
 
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        forecast: forecastData,
        location,
        address
      })
    })
  })
  

})

app.get('/products', (req, res) => {
  // Query string is on request as a JS object
  if (!req.query.search) {
    return res.send({
      error: 'Ýou must provide a search term'
    })
  }
  
  res.send({
    products: []
  })
})

// 404 pages specifically for the help area
app.get('/help/*', (req, res) => {
  res.render('404', {
    message: 'Help article not found',
    title: 'Help 404',
    name: 'Brian Lavery'
  })
})

// 404 event handler - needs to come last
app.get('*', (req, res) => {
  res.render('404', {
    message: 'Page not found',
    title: '404',
    name: 'Brian Lavery'
  })
})


// Start server using this one app
// We pass in the port as the argument
app.listen(3000, () => {
  // Message is for person running the app
  console.log('Server started on port 3000')
})