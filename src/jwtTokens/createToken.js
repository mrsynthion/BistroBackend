const jwt = require('jsonwebtoken');
require('dotenv').config();
const createAccessToken = (username) =>
  jwt.sign({ userName: username }, process.env.PRIVATE_KEY, {
    expiresIn: '15min',
  });
const createRefreshToken = (username) =>
  jwt.sign({ userName: username }, process.env.PRIVATE_KEY, {
    expiresIn: '7d',
  });
module.exports = { createAccessToken, createRefreshToken };
