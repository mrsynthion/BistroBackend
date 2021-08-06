const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (userName, userType) =>
  jwt.sign({ userName, userType }, process.env.PRIVATE_KEY_ACCESS, {
    expiresIn: '1min',
  });
const createRefreshToken = (userName, userType) =>
  jwt.sign({ userName, userType }, process.env.PRIVATE_KEY_REFRESH, {
    expiresIn: '7d',
  });
module.exports = { createAccessToken, createRefreshToken };
