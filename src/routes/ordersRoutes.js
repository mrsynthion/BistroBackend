const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Orders = require('../db/models/account/orderModel');

router.get('/', (req, res) =>
  Orders.findAll()
    .then((orders) => {
      console.log(orders);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
