const config = require('../config')
const mongoose = require('mongoose')

const gradeScheme = {
    name: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        min: 0,
        max: Infinity
    },
    weight: {
        type: Number,
        default: 1,
        min: 0,
        max: Infinity
    }
}

module.exports = mongoose.model('Grade', gradeScheme)