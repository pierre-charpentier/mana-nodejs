const router = require('express').Router();
const ical = require('ical');

const icalUrl = "https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=1879&projectId=3&calType=ical&firstDate=2016-09-01&lastDate=2017-09-30";

router.get('/', (req, res) => {
    ical.fromURL(icalUrl, {}, (err, data) => {
        res.json(data);
    });
});

module.exports = router;