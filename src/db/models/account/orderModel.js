const Sequelize = require('sequelize');
const db = require('../../config/database');

const OrdersModel = db.define('Orders', {
  orderUserId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orderMenuItemsId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orderTotalPrice: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orderPlaceToOrder: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  orderIsSent: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  orderIsAccepted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = OrdersModel;
