const Sequelize = require('sequelize');
const db = require('../../config/database');

const OrdersModel = db.define('Orders', {
  orderUserId: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  orderMenuItemsId: {
    type: Sequelize.NUMBER,
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
  orderIsCompleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = OrdersModel;
