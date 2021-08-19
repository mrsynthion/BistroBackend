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

module.exports = router;
