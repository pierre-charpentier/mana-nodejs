const config = require('../config')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Grade = require('./grade')

const sectionScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        default: 1,
        min: 0,
        max: Infinity
    },
    isTopLevel: {
        type: Boolean,
        required: true,
        default: false
    },
    subSections: [{ type: String, ref: 'Section' }],
    grades: [{ type: String, ref: 'Grade' }]
})

module.exports = mongoose.model('Section', sectionScheme)