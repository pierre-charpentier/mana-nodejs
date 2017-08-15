const Section = require('../../../models/section')
const router = require('express').Router()

router.get('/', (req, res) => {
    Section.find().populate('grades').exec((err, sections) => {
        for (let i = 0; i < sections.length; i++) {
            let gradeSum = 0
            let weightSum = 0

            for (let grade in sections[i].grades) {
                gradeSum += grade.grade
                weightSum += grade.weight
            }

            sections[i].grade = (gradeSum / weightSum).toFixed(2)
            console.log((gradeSum / weightSum).toFixed(2))
        }

        res.send(sections)
    })
})

router.get('/topLevel', (req, res) => {
    Section.find({ isTopLevel: true }).populate('grades').exec((err, sections) => {
        if(err) res.sendStatus(400)
        else res.send(sections)
    })
})

router.get('/:id', (req, res) => {
    if(!req.params.id) res.sendStatus(400)
    Section.find({ _id: req.params.id }, (err, section) => {
        if (err)
            res.sendStatus(400)
        else
            res.send(section[0])
    })
})

router.put('/:id/grades', (req, res) => {
    if(!req.params.id) res.sendStatus(400)
    Section.update({ _id: req.params.id }, { $push: { grades: req.body.gradeId }}, (err) => {
        if (err)
            res.sendStatus(400)
        else
            res.sendStatus(200)
    })
})

router.put('/:id', (req, res) => {
    if(!req.params.id) res.sendStatus(400)
    Section.update({ _id: req.params.id }, { $set: req.body }, (err) => {
        if (err)
            res.sendStatus(400)
        else
            res.sendStatus(200)
    })
})

router.post('/', (req, res) => {
    let newSection = new Section(req.body)
    newSection.save(function (err) {
        if (err)
            res.sendStatus(400) // TODO: Handle this shit better
        else
            res.sendStatus(200)
    })
})

router.delete('/:id', (req, res) => {
    if(!req.params.id) res.sendStatus(400)

    Section.find({ _id: req.params.id }).remove(function (err, result) {
        if (err)
            res.sendStatus(400) // TODO: Handle this shit better
        else
            res.send(result)
    })
})

module.exports = router