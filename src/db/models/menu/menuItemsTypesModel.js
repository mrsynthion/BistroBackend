const Sequelize = require('sequelize');
const db = require('../../config/database');

const MenuItemsTypes = db.define('MenuItemsTypes', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = MenuItemsTypes;
