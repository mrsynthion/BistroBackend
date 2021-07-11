const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Users = require('../db/models/usersModel');

router.get('/', (req, res) =>
  Users.findAll()
    .then((users) => {
      console.log(users);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
