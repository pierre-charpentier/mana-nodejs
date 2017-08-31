const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const config = require('./config.json')
//const grades = require('./routes/api/grades/grades')
//const sections = require('./routes/api/grades/sections')
const calendar = require('./routes/agenda/calendar')

mongoose.connect(config.database.url)

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use("/calendar", calendar);

app.listen(3000, () => {
    console.log('Server is listening!')
})