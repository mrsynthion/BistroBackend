const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Schedule = require('../../db/models/restaurant/scheduleModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

router.get('/', (req, res) => {
  Schedule.findAll()
    .then((schedule) => {
      res.statusCode = 200;
      res.json(schedule);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.json(err);
    });
});

router.post('/addSchedule', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Schedule.findAll()
      .then((schedule) => {
        if (schedule.length < 8) {
          Schedule.create({
            scheduleWeekDay: req.body.scheduleWeekDay,
            scheduleOpeningHour: req.body.scheduleOpeningHour,
            scheduleCloseHour: req.body.scheduleCloseHour,
          })
            .then((scheduleDay) => {
              res.statusCode = 201;
              res.json(scheduleDay);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.json({
                message:
                  'There is problem with adding schedule day to database',
                err,
              });
            });
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          message: 'There is problem with adding schedule day to database',
          err,
        });
      });
  }
});
router.post('/updateSchedule', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Schedule.update({
      scheduleWeekDay: req.body.scheduleWeekDay,
      scheduleOpeningHour: req.body.scheduleOpeningHour,
      scheduleCloseHour: req.body.scheduleCloseHour,
    })
      .then((scheduleDay) => {
        res.statusCode = 201;
        res.json(scheduleDay);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          message: 'There is problem with updating schedule day in database',
          err,
        });
      });
  }
});

module.exports = router;
