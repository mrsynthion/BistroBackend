const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Users = require('../../db/models/account/usersModel');
const bcrypt = require('bcrypt');
const saltRounds = 2;
const userTypes = require('../../../consts');
const {
  createAccessToken,
  createRefreshToken,
} = require('../../jwtTokens/createToken');
const {
  verifyAccess,
  invalidateTokens,
} = require('../../jwtTokens/verifyToken');

router.get('/', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (data && data.userType === userTypes.ADMIN) {
    Users.findAll()
      .then((users) => {
        res.statusCode = 200;
        res.json(users);
      })
      .catch((err) => res.json({ ...err, message: 'Błąd serwera' }));
  } else {
    res.statusCode = 401;
    res.json({ message: 'Nie jesteś adminem' });
  }
});

router.post('/addUser', (req, res) => {
  Users.findOne({ where: { userUsername: req.body.userUsername } })
    .then((user) => {
      if (user) {
        res.statusCode = 400;
        res.json({ message: 'Nazwa uzytkownika jest zajęta' });
      } else {
        bcrypt
          .hash(req.body.userPassword, saltRounds)
          .then((hash) => {
            console.log(hash);
            if (!req.body.userType) {
              console.log('siema1');
              console.log(req.body);
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
                userType: userTypes.USER,
              })
                .then((result) => {
                  console.log('siema2');
                  res.statusCode = 201;
                  res.json(result);
                })
                .catch((err) => {
                  console.log('siema3');
                  res.statusCode = 500;
                  res.json({ ...err, message: 'Błąd serwera1' });
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
                  res.json(result);
                })
                .catch((err) => {
                  res.statusCode = 500;
                  res.json({ ...err, message: 'Błąd serwera2' });
                });
            }
          })
          .catch((err) => {
            res.statusCode = 500;
            res.json({ ...err, message: 'Błąd serwera3' });
          });
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.json({ ...err, message: 'Błąd serwera' });
    });
});

router.post('/updateUser', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    res.statusCode = 401;
    res.redirect('/');
  }
  if (data && data.userUsername === req.body.userUsername) {
    Users.update(
      {
        userName: req.body.userName,
        userLastName: req.body.userLastName,
        userCity: req.body.userCity,
        userAdressStreetName: req.body.userAdressStreetName,
        userAdressStreetNumber: req.body.userAdressStreetNumber,
        userAdressHomeNumber: req.body.userAdressHomeNumber,
        userPhoneNumber: req.body.userPhoneNumber,
        userPassword: req.body.userPassword,
      },
      { where: { id: req.body.id } }
    )
      .then((result) => {
        res.statusCode = 200;
        res.json(result);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({ ...err, message: 'Błąd serwera' });
      });
  }
});

router.delete('/deleteUser', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    res.statusCode = 401;
    res.redirect('/');
  }
  if (data && data.userType === userTypes.USER) {
    Users.destroy({ where: { userUsername: data.userUsername } })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  } else {
    if (
      (data && data.userType === userTypes.ADMIN) ||
      (data && data.userType === userTypes.PERSONEL)
    ) {
      Users.destroy({ where: { id: req.body.id } })
        .then(() => {
          res.sendStatus(200);
        })

        .catch((err) => {
          res.statusCode = 500;
          res.json(err);
        });
    } else {
      res.statusCode = 401;
      res.redirect('/');
    }
  }
});

router.post('/login', (req, res) => {
  console.log(req.body);
  Users.findOne({ where: { userUsername: req.body.userUsername } })
    .then((data) => {
      console.log(data);
      bcrypt
        .compare(req.body.userPassword, data.userPassword)
        .then((result) => {
          if (result === true) {
            const accessToken = createAccessToken(
              req.body.userUsername,
              data.userType
            );
            const refreshToken = createRefreshToken(
              req.body.userUsername,
              data.userType
            );
            res.statusCode = 200;
            res.cookie('access-token', accessToken, {
              expires: new Date(Date.now() + 900000),
              secure: true,
              httpOnly: true,
            });
            res.cookie('refresh-token', refreshToken, {
              expires: new Date(Date.now() + 604800000),
              secure: true,
              httpOnly: true,
            });

            const { userUsername, userName } = data.dataValues;
            res.json({ userUsername, userName });
          } else {
            res.statusCode = 401;
            res.json({ message: 'Nieprawidłowe dane logowania' });
          }
        })
        .catch(() => {
          res.statusCode = 401;
          res.json({ message: 'Nieprawidłowe dane logowania' });
        });
    })
    .catch(() => {
      res.statusCode = 401;
      res.json({ message: 'Nieprawidłowe dane logowania' });
    });
});

router.post('/logout', (req, res) => {
  invalidateTokens(res);
  res.statusCode = 200;
  res.json({ message: 'Wylogowywanie pomyślne' });
});

module.exports = router;
