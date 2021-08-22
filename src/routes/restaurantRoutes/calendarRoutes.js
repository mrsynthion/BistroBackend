const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Calendar = require('../../db/models/restaurant/calendarModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');
const { Op } = require('sequelize');

router.get('/', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.USER ||
      data.userType === userTypes.ADMIN ||
      data.userType === userTypes.PERSONEL)
  ) {
    Calendar.findAll()
      .then((calendar) => {
        res.statusCode = 200;
        res.json(calendar);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({ ...err, message: 'Błąd serwera' });
      });
  }
});
router.post('/addCalendar', (req, res) => {
  const startDate = Date.parse(req.body.calendarStartDate);
  const endDate = Date.parse(req.body.calendarEndDate);
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN ||
      data.userType === userTypes.PERSONEL ||
      data.userType === userTypes.USER)
  ) {
    Calendar.findOne({
      where: {
        calendarTableId: req.body.calendarTableId,
        calendarStartDate: { [Op.gte]: startDate },
        calendarEndDate: { [Op.lte]: endDate },
      },
    })
      .then((calendar) => {
        if (!calendar) {
          Calendar.create({
            calendarStartDate: startDate,
            calendarEndDate: endDate,
            calendarTableId: req.body.calendarTableId,
            calendarUserId: req.body.calendarUserId,
            calendarIsConfirmed: req.body.calendarIsConfirmed,
          })
            .then((calendar) => {
              res.statusCode = 201;
              res.json(calendar);
            })
            .catch((err) => {
              res.statusCode = 500;
              res.json({ ...err, message: 'Błąd serwera' });
            });
        } else {
          res.json({ message: 'Termin zajęty' });
        }
      })
      .catch((err) => {
        res.json({ ...err, message: 'Błąd serwera' });
      });
  }
});

router.post('/updateCalendar', (req, res) => {
  const startDate = Date.parse(req.body.calendarStartDate);
  const endDate = Date.parse(req.body.calendarEndDate);
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Calendar.update(
      {
        calendarStartDate: startDate,
        calendarEndDate: endDate,
        calendarTableId: req.body.calendarTableId,
        calendarUserId: req.body.calendarUserId,
        calendarIsConfirmed: req.body.calendarIsConfirmed,
      },
      { where: { id: req.body.id } }
    )
      .then((calendar) => {
        res.statusCode = 200;
        res.json(calendar);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({ ...err, message: 'Błąd serwera' });
      });
  }
});

module.exports = router;
