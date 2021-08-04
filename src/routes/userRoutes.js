const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Users = require('../db/models/account/usersModel');
const bcrypt = require('bcrypt');
const saltRounds = 2;

router.get('/', (req, res) =>
  Users.findAll()
    .then((users) => {
      res.statusCode = 200;
      res.json(users);
    })
    .catch((err) => console.log(err))
);

router.post('/addUser', (req, res) => {
  Users.findOne({ where: { userUsername: req.body.userUsername } })
    .then((user) => {
      if (user) {
        res.statusCode = 400;
        res.send('Username already taken');
      } else {
        bcrypt
          .hash(req.body.userPassword, saltRounds)
          .then((hash) => {
            Users.create({
              userName: req.body.userName,
              userLastName: req.body.userLastName,
              userCity: req.body.userCity,
              userAdressStreetName: req.body.userAdressStreetName,
              userAdressStreetNumber: req.body.userAdressStreetNumber,
              userAdressHomeNumber: req.body.userAdressHomeNumber,
              userPhoneNumber: req.body.userPhoneNumber,
              userUsername: req.body.userUsername,
              userPassword: hash,
            })
              .then((result) => {
                res.statusCode = 201;
                res.send(result);
              })
              .catch((err) => {
                res.statusCode = 500;
                res.send(err);
              });
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.send(err);
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
      res.statusCode = 200;
      res.send(result);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.send(err);
    });
});

router.delete('/deleteUser', (req, res) => {
  Users.destroy({ where: { id: req.body.id } })
    .then((res) => {
      res.statusCode(200);
      res.send(res);
    })
    .catch((err) => {
      res.statusCode = 500;
      res.send(err);
    });
});

router.post('/login', (req, res) => {
  Users.findOne({ where: { userUsername: req.body.userUsername } })
    .then((data) => {
      bcrypt
        .compare(req.body.userPassword, data.userPassword)
        .then((result) => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch((err) => {
          res.statusCode = 401;
          res.send(err);
        });
    })
    .catch((err) => {
      res.statusCode = 401;
      res.send(err);
    });
});

module.exports = router;
