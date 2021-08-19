const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Orders = require('../../db/models/account/orderModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

router.post('/addOrder', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (data && data.userType === userTypes.USER) {
    Orders.create({
      orderUserUsername: req.body.userName,
      orderMenuItemsId: req.body.itemsId,
      orderTotalPrice: req.body.totalPrice,
      orderPlaceToOrder: req.body.placeToOrder,
      orderIsSent: req.body.isSent,
      orderIsAccepted: req.body.isAccepted,
    })
      .then((result) => {
        res.statusCode = 201;
        res.json(result);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.get('/history', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (data && data.userType === userTypes.USER) {
    Orders.findAll({ where: { orderUserUsername: data.userUsername } })
      .then((orders) => {
        orders.reverse();
        res.statusCode = 200;
        res.json(orders);
      })
      .catch((err) => {
        res.statusCode = 401;
        res.json(err);
      });
  }
  if (
    (data && data.userType === userTypes.PERSONEL) ||
    (data && data.userType === userTypes.ADMIN)
  ) {
    Orders.findAll()
      .then((orders) => {
        orders.reverse();
        res.statusCode = 200;
        res.json(orders);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.post('/update', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (data && data.userType === userTypes.ADMIN) {
    Orders.update({
      orderIsSent: req.body.isSent,
      orderIsAccepted: req.body.isAccepted,
    })
      .then((result) => {
        res.statusCode = 201;
        res.json(result);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

module.exports = router;
