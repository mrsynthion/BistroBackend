const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Schedule = require('../db/models/scheduleModel');

router.get('/', (req, res) =>
  Schedule.findAll()
    .then((schedule) => {
      console.log(schedule);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
