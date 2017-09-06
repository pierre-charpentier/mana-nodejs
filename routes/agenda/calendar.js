const router = require('express').Router();
const ical = require('ical');
const Moment = require('moment');

function buildIcalURL(opts) {
    let url = "";
    let { resources, projectId, firstDate, lastDate } = { ...opts };
    const baseURL = process.env.ICAL_BASE_URL;

    if (resources && projectId) { // Might need to better validate that
        firstDate = firstDate ? firstDate : Moment().format("YYYY-MM-DD");
        lastDate = lastDate ? lastDate : Moment().add(30, 'days').format("YYYY-MM-DD");

        url += baseURL;
        url += "?calType=ical";
        url += "&resources=" + resources;
        url += "&projectId=" + projectId;
        url += "&firstDate=" + firstDate;
        url += "&lastDate=" + lastDate;
    }

    return url;
}

function getResources(byDay, req, res) {
    const { resources } = { ...req.params };
    const { projectId, firstDate, lastDate } = { ...req.query };

    
    let url = buildIcalURL({ resources: resources, projectId: projectId, firstDate: firstDate, lastDate: lastDate });

    console.log(url);
    ical.fromURL(url, {}, (err, data) => {
        // This loop is done twice, could find a way to merge them
        // Extract teacher name from summary data
        for (let event in data) {                
            data[event].teachers = data[event].description.match(/[A-Z]*\s([A-Z]{1}\.)+/g);
        }

        if (byDay) {
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
        } else {
            res.json(data);
        }
    });
}

router.get('/:resources', (req, res) => {
    getResources(false, req, res);
});

router.get('/:resources/byDay', (req, res) => {
    getResources(true, req, res);
});

module.exports = router;