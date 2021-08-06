const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (userUsername, userType) =>
  jwt.sign({ userUsername, userType }, process.env.PRIVATE_KEY_ACCESS, {
    expiresIn: '15min',
  });
const createRefreshToken = (userUsername, userType) =>
  jwt.sign({ userUsername, userType }, process.env.PRIVATE_KEY_REFRESH, {
    expiresIn: '7d',
  });
module.exports = { createAccessToken, createRefreshToken };
