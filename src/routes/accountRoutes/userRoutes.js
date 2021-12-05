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
  checkCookies,
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

router.get('/data', (req, res) => {
  const data = verifyAccess(req, res);

  if (data) {
    Users.findOne({ where: { id: data?.id } })
      .then((user) => {
        res.statusCode = 200;
        delete user.dataValues['userPassword'];
        res.json(user.dataValues);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json({ ...err, message: 'Błąd serwera1' });
      });
  } else {
    checkCookies(req, res);
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
                userType: userTypes.USER,
              })
                .then((result) => {
                  res.statusCode = 201;
                  delete result.dataValues['userPassword'];

                  res.send(result.dataValues);
                })
                .catch((err) => {
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
                  delete result.dataValues['userPassword'];

                  res.send(result.dataValues);
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

router.put('/', (req, res) => {
  const user = req.body;
  const data = verifyAccess(req, res);

  if (data && data.id === req.body.id) {
    console.log(data);
    if (req.body.userPassword && req.body.userPassword.length !== 0) {
      bcrypt
        .hash(req.body.userPassword, saltRounds)
        .then((hash) => {
          Users.findOne({ where: { id: user.id } }).then((user) =>
            user
              .update({
                userName: req.body.userName,
                userLastName: req.body.userLastName,
                userCity: req.body.userCity,
                userAdressStreetName: req.body.userAdressStreetName,
                userAdressStreetNumber: req.body.userAdressStreetNumber,
                userAdressHomeNumber: req.body.userAdressHomeNumber,
                userPhoneNumber: req.body.userPhoneNumber,
                userPassword: hash,
              })
              .then((result) => {
                res.statusCode = 200;
                delete result.dataValues['userPassword'];

                res.send(result.dataValues);
              })
              .catch((err) => {
                res.statusCode = 500;
                res.json({ ...err, message: 'Błąd serwera' });
              })
          );
        })
        .catch((e) => {
          console.log(e);
          res.statusCode = 500;
          res.send('Error z hasłem');
        });
    } else {
      Users.findOne({ where: { id: user.id } }).then((user) =>
        user
          .update(
            {
              userName: req.body.userName,
              userLastName: req.body.userLastName,
              userCity: req.body.userCity,
              userAdressStreetName: req.body.userAdressStreetName,
              userAdressStreetNumber: req.body.userAdressStreetNumber,
              userAdressHomeNumber: req.body.userAdressHomeNumber,
              userPhoneNumber: req.body.userPhoneNumber,
            },
            { where: { id: req.body.id } }
          )
          .then((result) => {
            res.statusCode = 200;
            delete result.dataValues['userPassword'];

            res.send(result.dataValues);
          })
          .catch((err) => {
            res.statusCode = 500;
            res.json({ ...err, message: 'Błąd serwera' });
          })
      );
    }
  }
});

router.delete('/deleteUser', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    res.statusCode = 401;
    res.redirect('/');
  }
  if (data && data.userType === userTypes.USER) {
    Users.destroy({ where: { id: data.id } })
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
  Users.findOne({ where: { userUsername: req.body.userUsername } })
    .then((data) => {
      bcrypt
        .compare(req.body.userPassword, data.userPassword)
        .then((result) => {
          if (result === true) {
            const accessToken = createAccessToken(
              data.id,
              data.userName,
              data.userType
            );

            const refreshToken = createRefreshToken(
              data.id,
              data.userName,
              data.userType
            );

            res.statusCode = 200;
            res.cookie('access-token', accessToken, {
              expires: new Date(Date.now() + 900000),
              httpOnly: true,
            });
            res.cookie('refresh-token', refreshToken, {
              expires: new Date(Date.now() + 604800000),
              httpOnly: true,
            });

            delete data.dataValues['userPassword'];

            res.send(data.dataValues);
          } else {
            res.statusCode = 401;
            res.json({ message: 'Nieprawidłowe dane logowania1' });
          }
        })
        .catch(() => {
          res.statusCode = 401;
          res.json({ message: 'Nieprawidłowe dane logowania2' });
        });
    })
    .catch(() => {
      res.statusCode = 401;
      res.send('Nieprawidłowe dane logowania');
    });
});

router.post('/logout', (req, res) => {
  if (req.cookies['access-token'] || req.cookies['refresh-token']) {
    invalidateTokens(res);
  }

  res.statusCode = 200;
  res.send('Udane wylogowywanie');
});

module.exports = router;
