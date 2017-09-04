const Grade = require('../../../models/grade')
const router = require('express').Router()

router.get('/', (req, res) => {
    Grade.find((err, grades) => {
        res.send(grades)
    })
})

router.get('/:id', (req, res) => {
    Grade.find({ _id: req.params.id }, (err, grades) => {
        if (err)
            res.sendStatus(400)
        else
            res.send(grades[0])
    })
})

router.put('/:id', (req, res) => {
    if(!req.params.id) res.sendStatus(400)
    Grade.update({ _id: req.params.id }, { $set: req.body }, (err) => {
        if (err)
            res.sendStatus(400)
        else
            res.sendStatus(200)
    })
})

router.post('/', (req, res) => {
    let newGrade = new Grade(req.body)
    newGrade.save(function (err, grade) {
        if (err)
            res.sendStatus(400) // TODO: Handle this shit better
        else
            res.send(grade)
    })
})

router.delete('/:id', (req, res) => {
    if(!req.params.id) res.sendStatus(400)

    Grade.find({ _id: req.params.id }).remove(function (err, result) {
        if (err)
            res.sendStatus(400) // TODO: Handle this shit better
        else
            res.send(result)
    })
})

module.exports = router