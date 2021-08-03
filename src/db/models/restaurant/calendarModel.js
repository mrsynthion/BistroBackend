const Sequelize = require('sequelize');
const db = require('../../config/database');

const CalendarModel = db.define('Calendar', {
  calendarStartDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  calendarEndDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  calendarTableId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  calendarUserId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  calendarIsConfirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = CalendarModel;
