const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Calendar = require('../../db/models/restaurant/calendarModel');
const Users = require('../../db/models/account/usersModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');
const { Op } = require('sequelize');

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

router.get('/', (req, res) => {
  const data = verifyAccess(req, res);

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
  } else {
    const getCalendars = async () => {
      try {
        const calendars = await Calendar.findAll();
        const newCalendars = calendars.map((calendar) => {
          delete calendar.dataValues['calendarUserId'];
          return calendar.dataValues;
        });
        res.statusCode = 200;
        res.send(newCalendars);
      } catch (e) {
        res.sendStatus(500);
      }
    };
    getCalendars();
  }
});

router.get('/:id', (req, res) => {
  Calendar.findAll({ where: { calendarTableId: req.params.id } })
    .then((calendars) => {
      res.statusCode = 200;
      res.json(calendars);
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = 500;
      res.send('Brak kalendarza');
    });
});
router.post('/addCalendar', (req, res) => {
  const startDate = Date.parse(req.body.calendarStartDate);
  const startDates = new Date(startDate).setHours(
    new Date(startDate).getHours() + 1
  );
  const endDate = Date.parse(req.body.calendarEndDate);
  const endDates = new Date(endDate).setHours(new Date(endDate).getHours() + 1);
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
        calendarStartDate: { [Op.gte]: startDates },
        calendarEndDate: { [Op.lte]: endDates },
      },
    })
      .then((calendar) => {
        if (!calendar) {
          Calendar.create({
            calendarStartDate: startDates,
            calendarEndDate: endDates,
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
router.get('/:day/:tableId', (req, res) => {
  const data = verifyAccess(req, res);
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    const tableId = req.params.tableId;
    const day = req.params.day;
    try {
      const myFunc = async () => {
        const calendars = await Calendar.findAll({
          where: { calendarTableId: tableId },
        });

        let newCalendars = calendars.map((calendar) => {
          if (sameDay(new Date(calendar.calendarStartDate), new Date(day))) {
            return calendar;
          }
        });
        newCalendars = newCalendars.filter((newCalendar) => !!newCalendar);
        let newCalendars2 = [];
        for (let i = 0; i < newCalendars.length; i++) {
          let user = await Users.findOne({
            where: { id: newCalendars[i].calendarUserId },
          });
          delete user.dataValues['userPassword'];
          delete user.dataValues['id'];
          let newCalendar2 = {
            ...newCalendars[i].dataValues,
            user: user.dataValues,
          };
          delete newCalendar2['calendarUserId'];

          newCalendars2.push(newCalendar2);
        }

        res.statusCode = 200;
        res.json(newCalendars2);
      };
      myFunc();
    } catch (e) {
      res.statusCode = 500;
      res.json({ ...err, message: 'Błąd serwera' });
    }
  } else {
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
