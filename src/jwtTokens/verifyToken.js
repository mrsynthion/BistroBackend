const jwt = require('jsonwebtoken');
const {
  createAccessToken,
  createRefreshToken,
} = require('../jwtTokens/createToken');
require('dotenv').config();

const verifyAccessToken = (accessToken) => {
  return jwt.verify(accessToken, process.env.PRIVATE_KEY_ACCESS);
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.PRIVATE_KEY_REFRESH);
};

const invalidateTokens = (res) => {
  res.clearCookie('access-token');
  res.clearCookie('refresh-token');
};

const verifyAccess = (req, res) => {
  const accessToken = req.headers['access-token'];
  const refreshToken = req.headers['refresh-token'];
  try {
    const vat = verifyAccessToken(accessToken);
    return vat;
  } catch {
    try {
      const vrt = verifyRefreshToken(refreshToken);
      const newAccessToken = createAccessToken(vrt.userName, vrt.userType);
      const newRefreshToken = createRefreshToken(vrt.userName, vrt.userType);
      res.cookie('access-token', newAccessToken);
      res.cookie('refresh-token', newRefreshToken);
      return vrt;
    } catch {
      invalidateTokens(res);
    }
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
  invalidateTokens,
  verifyAccess,
};
