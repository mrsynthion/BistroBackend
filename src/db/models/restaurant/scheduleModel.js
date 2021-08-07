const Sequelize = require('sequelize');
const db = require('../../config/database');

const ScheduleModel = db.define('Schedule', {
  scheduleWeekDay: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  scheduleOpeningHour: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  scheduleCloseHour: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ScheduleModel;
