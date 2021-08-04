const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Users = require('../db/models/account/usersModel');
const bcrypt = require('bcrypt');
const saltRounds = 2;
const {
  createAccessToken,
  createRefreshToken,
} = require('../jwtTokens/createToken');

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
            if (!req.body.userType) {
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
                userType: 'user'.toUpperCase(),
              })
                .then((result) => {
                  res.statusCode = 201;
                  res.send(result);
                })
                .catch((err) => {
                  res.statusCode = 500;
                  res.send(err);
                });
            } else {
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
                userType: req.body.userType.toUpperCase(),
              })
                .then((result) => {
                  res.statusCode = 201;
                  res.send(result);
                })
                .catch((err) => {
                  res.statusCode = 500;
                  res.send(err);
                });
            }
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
          if (result === true) {
            const accessToken = createAccessToken(req.body.userUsername);
            const refreshToken = createRefreshToken(req.body.userUsername);

            res.statusCode = 200;
            res.cookie('refresh-token', refreshToken, {
              expires: new Date(Date.now() + 604800000),
            });
            res.cookie('access-token', accessToken, {
              expires: new Date(Date.now() + 900000),
            });
            res.send(result);
          } else {
            res.sendStatus(401);
          }
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
