const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAccessToken = (id, userName, userType) => {
  console.log(id, userName, userType);
  return jwt.sign({ id, userName, userType }, process.env.PRIVATE_KEY_ACCESS, {
    expiresIn: '15min',
  });
};
const createRefreshToken = (id, userName, userType) =>
  jwt.sign({ id, userName, userType }, process.env.PRIVATE_KEY_REFRESH, {
    expiresIn: '7d',
  });
module.exports = { createAccessToken, createRefreshToken };
