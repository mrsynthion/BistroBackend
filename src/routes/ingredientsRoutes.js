const express = require('express');
const router = express.Router();
const db = require('../db/config/database');
const Ingredients = require('../db/models/menu/ingredientsModel');

router.get('/', (req, res) =>
  Ingredients.findAll()
    .then((ingredients) => {
      console.log(ingredients);
      res.sendStatus(200);
    })
    .catch((err) => console.log(err))
);

module.exports = router;
