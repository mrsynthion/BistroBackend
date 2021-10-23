const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const MenuItemType = require('../../db/models/menu/menuItemTypeModel');
const { verifyAccess } = require('../../jwtTokens/verifyToken');
const userTypes = require('../../../consts');

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
    MenuItemType.findAll()
      .then((menuItemType) => {
        res.statusCode = 200;
        res.json(menuItemType);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
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
    MenuItemType.create({
      name: req.body.name,
    })
      .then((menuItemType) => {
        res.statusCode = 201;
        res.json(menuItemType);
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
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    MenuItemType.update(
      {
        name: req.body.name,
      },
      { where: { id: req.body.id } }
    )
      .then((menuItemType) => {
        res.statusCode = 200;
        res.json(menuItemType);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
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
    MenuItemType.destroy({ where: { id: req.body.id } })
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
