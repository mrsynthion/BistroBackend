const Sequelize = require('sequelize');
const db = require('../../config/database');

const TablesModel = db.define('Tables', {
  tableQuantityOfSeats: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
});

module.exports = TablesModel;
