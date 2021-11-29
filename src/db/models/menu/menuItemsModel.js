const Sequelize = require('sequelize');
const db = require('../../config/database');

const MenuItems = db.define('MenuItems', {
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
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = MenuItems;
