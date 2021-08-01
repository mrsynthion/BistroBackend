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
    allowNull: true,
  },
  userAdressStreetName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  userAdressStreetNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  userAdressHomeNumber: {
    type: Sequelize.STRING,
    allowNull: true,
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
});

module.exports = UsersModel;
