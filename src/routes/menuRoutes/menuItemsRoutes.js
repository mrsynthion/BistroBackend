const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const MenuItems = require('../../db/models/menu/menuItemsModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

router.get('/', (req, res) => {
  MenuItems.findAll()
    .then((menuItems) => {
      res.statusCode = 200;
      res.json(menuItems);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.json(err);
    });
});
router.post('/', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    MenuItems.create({
      menuItemName: req.body.menuItemName,
      menuItemCategory: req.body.menuItemCategory,
      menuItemDescription: req.body.menuItemDescription,
      menuItemPrice: req.body.menuItemPrice,
    })
      .then((menuItem) => {
        res.statusCode = 201;
        res.json(menuItem);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.put('/', (req, res) => {
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
    MenuItems.update(
      {
        menuItemName: req.body.menuItemName,
        menuItemCategory: req.body.menuItemCategory,
        menuItemDescription: req.body.menuItemDescription,
        menuItemPrice: req.body.menuItemPrice,
      },
      { where: { id: req.body.id } }
    )
      .then(() => {
        res.statusCode = 200;
        res.send('Edycja zakończona poprawnie');
      })
      .catch(() => {
        res.statusCode = 500;
        res.send('Edycja nie udała się');
      });
  }
});

router.delete('/', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    MenuItems.destroy({ where: { id: req.body.id } })
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.send(err);
      });
  } else {
    res.statusCode = 401;
    res.redirect('/');
  }
});

module.exports = router;
