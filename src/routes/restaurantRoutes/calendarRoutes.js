const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Calendar = require('../../db/models/restaurant/calendarModel');

router.get('/', (req, res) =>
  Calendar.findAll()
    .then((calendar) => {
      console.log(calendar);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
