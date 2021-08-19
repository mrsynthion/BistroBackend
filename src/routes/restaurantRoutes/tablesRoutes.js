const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Tables = require('../../db/models/restaurant/tablesModel');

router.get('/', (req, res) =>
  Tables.findAll()
    .then((tables) => {
      console.log(tables);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
