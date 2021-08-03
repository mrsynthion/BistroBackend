const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Users = require('../db/models/account/usersModel');

router.get('/', (req, res) =>
  Users.findAll()
    .then((users) => {
      res.json(users);
      console.log(users);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);
router.post('/addUser', (req, res) => {
  Users.create({
    userName: req.body.userName,
    userLastName: req.body.userLastName,
    userCity: req.body.userCity,
    userAdressStreetName: req.body.userAdressStreetName,
    userAdressStreetNumber: req.body.userAdressStreetNumber,
    userAdressHomeNumber: req.body.userAdressHomeNumber,
    userPhoneNumber: req.body.userPhoneNumber,
    userUsername: req.body.userUsername,
    userPassword: req.body.userPassword,
  })
    .then(() => res.sendStatus(201))
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/updateUser', (req, res) => {
  Users.update(
    {
      userName: req.body.userName,
      userLastName: req.body.userLastName,
      userCity: req.body.userCity,
      userAdressStreetName: req.body.userAdressStreetName,
      userAdressStreetNumber: req.body.userAdressStreetNumber,
      userAdressHomeNumber: req.body.userAdressHomeNumber,
      userPhoneNumber: req.body.userPhoneNumber,
      userUsername: req.body.userUsername,
      userPassword: req.body.userPassword,
    },
    { where: { id: req.body.id } }
  )
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
