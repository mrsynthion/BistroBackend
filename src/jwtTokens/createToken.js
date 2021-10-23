const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (id, userType) =>
  jwt.sign({ id, userType }, process.env.PRIVATE_KEY_ACCESS, {
    expiresIn: '15min',
  });
const createRefreshToken = (id, userType) =>
  jwt.sign({ id, userType }, process.env.PRIVATE_KEY_REFRESH, {
    expiresIn: '7d',
  });
module.exports = { createAccessToken, createRefreshToken };
