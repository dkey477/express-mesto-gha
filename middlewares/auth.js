// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;
  try {
    if (!token) {
      next(new UnauthorizedError('Авторизуйтесь'));
    }
    payload = jwt.verify(token, 'secret');
  } catch (err) {
    next(new UnauthorizedError('Авторизуйтесь'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
