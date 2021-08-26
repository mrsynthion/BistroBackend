const Sequelize = require('sequelize');
const db = require('../../config/database');

const UsersModel = db.define('Users', {
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userLastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userCity: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userAdressStreetName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userAdressStreetNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userAdressHomeNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userPhoneNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  userUsername: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = UsersModel;
