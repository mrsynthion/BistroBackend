const Sequelize = require('sequelize');
const db = require('../../config/database');

const MenuItemType = db.define('MenuItemType', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = MenuItemType;
