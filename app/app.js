const express = require('express')
const bodyParser = require('body-parser')

const containerRoute = require('./routes/container')
const movementRoute = require('./routes/movement')
const reportRoute = require('./routes/report')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/containers', containerRoute)
app.use('/movements', movementRoute)
app.use('/reports', reportRoute)

module.exports = app