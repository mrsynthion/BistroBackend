const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Tables = require('../../db/models/restaurant/tablesModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

router.get('/', (req, res) => {
  Tables.findAll()
    .then((tables) => {
      res.statusCode = 200;
      res.json(tables);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.json(err);
    });
});

router.post('/addTable', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Tables.create({
      tableQuantityOfSeats: req.body.tableQuantityOfSeats,
    })
      .then((table) => {
        res.statusCode = 201;
        res.json(table);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          message: 'There is problem with adding table day to database',
          err,
        });
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          message: 'There is problem with adding table day to database',
          err,
        });
      });
  }
});
router.post('/updateTable', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Tables.update({
      tableQuantityOfSeats: req.body.tableQuantityOfSeats,
    })
      .then((table) => {
        res.statusCode = 201;
        res.json(table);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({
          message: 'There is problem with updating table day in database',
          err,
        });
      });
  }
});

module.exports = router;
