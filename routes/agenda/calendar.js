const router = require('express').Router();
const ical = require('ical');
const Moment = require('moment');

function buildIcalURL(opts) {
    let url = "";
    let { resources, projectId, firstDate, lastDate } = { ...opts };
    const baseURL = "https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?calType=ical";

    if (resources && projectId) { // Might need to better validate that
        firstDate = firstDate ? firstDate : Moment().subtract(10, 'days').format("YYYY-MM-DD");
        lastDate = lastDate ? lastDate : Moment().add(30, 'days').format("YYYY-MM-DD");

        url += baseURL;
        url += "&resources=" + resources;
        url += "&projectId=" + projectId;
        url += "&firstDate=" + firstDate;
        url += "&lastDate=" + lastDate;
    }

    return url;
}

router.get('/:resources', (req, res) => {
    const { resources } = { ...req.params };
    const { projectId, firstDate, lastDate } = { ...req.query };
    
    let url = buildIcalURL({ resources: resources, projectId: projectId, firstDate: firstDate, lastDate: lastDate });

    ical.fromURL(url, {}, (err, data) => {
        res.json(data);
    });
});

router.get('/:resources/byDay', (req, res) => {
    const { resources } = { ...req.params };
    const { projectId, firstDate, lastDate } = { ...req.query };
    
    let url = buildIcalURL({ resources: resources, projectId: projectId, firstDate: firstDate, lastDate: lastDate });

    ical.fromURL(url, {}, (err, data) => {
        let sortedData = {};

        for (let event in data) {
            let startDay = Moment(data[event].start).format('YYYY-MM-DD');
            
            if (!sortedData.hasOwnProperty(startDay)) {
                sortedData[startDay] = [];
            }

            sortedData[startDay].push(data[event]);
        }

        for (let day in sortedData) {
            sortedData[day].sort((a, b) => {
                return Moment(a.start).isAfter(b.start);
            });
        }

        res.json(sortedData);
    });
});

module.exports = router;