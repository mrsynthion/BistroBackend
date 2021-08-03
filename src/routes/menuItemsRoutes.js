const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const MenuItems = require('../db/models/MenuItemsModel');

router.get('/', (req, res) =>
  MenuItems.findAll()
    .then((menuItems) => {
      console.log(menuItems);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
