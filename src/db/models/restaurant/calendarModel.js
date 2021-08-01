const Sequelize = require('sequelize');
const db = require('../../config/database');

const CalendarModel = db.defive('Calendar', {
  calendarStartDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  calendarEndDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  calendarTableId: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  calendarUserId: {
    type: Sequelize.NUMBER,
    allowNull: false,
  },
  calendarIsConfirmed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = CalendarModel;
