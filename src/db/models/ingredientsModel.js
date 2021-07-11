const Sequelize = require('sequelize');
const db = require('../config/database');

const IngredientsModel = db.define('Ingredients', {
  ingredientName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ingredientPrice: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ingredientType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
