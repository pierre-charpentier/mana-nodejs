const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const config = require('./config.json')
const grades = require('./routes/api/grades/grades')
const sections = require('./routes/api/grades/sections')
const apiPrefix = '/api'

mongoose.connect(config.database.url)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', express.static('public/build'))
app.use(apiPrefix + '/grades', grades)
app.use(apiPrefix + '/sections', sections)

app.listen(3000, () => {
    console.log('Server is listening!')
})