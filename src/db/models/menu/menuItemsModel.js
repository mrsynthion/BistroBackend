const Sequelize = require('sequelize');
const db = require('../config/database');

const MenuItemsModel = db.define('MenuItems', {
  menuItemName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  menuItemCategory: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  menuItemDescription: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  menuItemPrice: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = MenuItemsModel;
