const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Orders = require('../../db/models/account/orderModel');
const MenuItems = require('../../db/models/menu/menuItemsModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

router.post('/addOrder', (req, res) => {
  const data = verifyAccess(req, res);

  if (
    data &&
    (data.userType === userTypes.USER ||
      data.userType === userTypes.PERSONEL ||
      data.userType === userTypes.ADMIN)
  ) {
    const menuItemsId = req.body.orderMenuItems
      .map((menuItem) => menuItem.id)
      .toString();

    Orders.create({
      orderUserId: parseInt(data.id),
      orderMenuItemsId: menuItemsId,
      orderTotalPrice: req.body.orderTotalPrice,
      orderPlaceToOrder: req.body.orderPlaceToOrder,
      orderIsSent: false,
      orderIsAccepted: false,
      orderUserName: req.body.orderUserName,
      orderUserLastName: req.body.orderUserLastName,
      orderUserPhoneNumber: req.body.orderUserPhoneNumber,
    })
      .then((result) => {
        res.statusCode = 201;
        res.json(result);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  } else if (!data) {
    const menuItemsId = req.body.orderMenuItems
      .map((menuItem) => menuItem.id)
      .toString();

    Orders.create({
      orderMenuItemsId: menuItemsId,
      orderTotalPrice: req.body.orderTotalPrice,
      orderPlaceToOrder: req.body.orderPlaceToOrder,
      orderIsSent: false,
      orderIsAccepted: false,
      orderUserName: req.body.orderUserName,
      orderUserLastName: req.body.orderUserLastName,
      orderUserPhoneNumber: req.body.orderUserPhoneNumber,
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
  if (data) {
    async function historyOrders() {
      const orders = await Orders.findAll({
        where: { orderUserId: data.id },
      });
      orders.reverse();
      console.log(orders.length);
      let newOrders = [];

      for (let x = 0; x < orders.length; x++) {
        console.log(orders[x].dataValues);
        let menuItemsData = [];
        let orderMenuItemsId = orders[x].dataValues.orderMenuItemsId.split(',');
        orderMenuItemsId = orderMenuItemsId.map((item) => parseInt(item));
        for (let i = 0; i < orderMenuItemsId.length; i++) {
          const data = await MenuItems.findOne({
            where: { id: orderMenuItemsId[i] },
          });

          menuItemsData.push(data.dataValues);
        }
        let newOrder = orders[x].dataValues;

        delete newOrder['orderMenuItemsId'];

        newOrders.push({ ...newOrder, menuItems: menuItemsData });
      }

      res.statusCode = 200;
      res.json(newOrders);
    }
    historyOrders();
  } else {
    if (
      (data && data.userType === userTypes.PERSONEL) ||
      (data && data.userType === userTypes.ADMIN)
    ) {
      async function historyOrders() {
        const orders = await Orders.findAll();
        orders.reverse();
        let newOrders = [];
        for (let x = 0; x < orders.length; x++) {
          let menuItemsData = [];
          let orderMenuItemsId = orders[x].orderMenuItemsId.split(',');
          orderMenuItemsId = orderMenuItemsId.map((item) => parseInt(item));
          for (let i = 0; i < orderMenuItemsId.length; i++) {
            const data = await MenuItems.findOne({
              where: { id: orderMenuItemsId[i] },
            });

            menuItemsData.push(data.dataValues);
          }
          let newOrder = orders[x].dataValues;

          delete newOrder['orderMenuItemsId'];

          newOrders.push({ ...newOrder, menuItems: menuItemsData });
        }

        res.statusCode = 200;
        res.json(newOrders);
      }
      historyOrders();
    } else {
      res.sendStatus(403);
    }
  }
});

router.post('/update', (req, res) => {
  const data = verifyAccess(req, res);
  if (
    (data && data.userType === userTypes.PERSONEL) ||
    (data && data.userType === userTypes.ADMIN)
  ) {
    Orders.update(
      {
        orderIsSent: req.body.orderIsSent,
        orderIsAccepted: req.body.orderIsAccepted,
      },
      { where: { id: req.body.orderId } }
    )
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
