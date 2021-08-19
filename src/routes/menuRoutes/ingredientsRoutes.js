const express = require('express');
const router = express.Router();
const db = require('../../db/config/database');
const Ingredients = require('../../db/models/menu/ingredientsModel');
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
    Ingredients.findAll()
      .then((ingredients) => {
        res.statusCode = 200;
        res.json(ingredients);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.post('/addIngredient', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Ingredients.create({
      ingredientName: req.body.ingredientName,
      ingredientPrice: req.body.ingredientPrice,
      ingredientType: req.body.ingredientType,
    })
      .then((ingredient) => {
        res.statusCode = 201;
        res.json(ingredient);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.post('/updateIngredient', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Ingredients.update(
      {
        ingredientName: req.body.ingredientName,
        ingredientPrice: req.body.ingredientPrice,
        ingredientType: req.body.ingredientType,
      },
      { where: { id: req.body.id } }
    )
      .then((ingredient) => {
        res.statusCode = 200;
        res.json(ingredient);
      })
      .catch((err) => {
        res.statusCode = 500;
        res.json(err);
      });
  }
});

router.delete('/deleteIngredient', (req, res) => {
  const data = verifyAccess(req, res);
  if (!data) {
    return;
  }
  if (
    data &&
    (data.userType === userTypes.ADMIN || data.userType === userTypes.PERSONEL)
  ) {
    Ingredients.destroy({ where: { id: req.body.id } })
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
