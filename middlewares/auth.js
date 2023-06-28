// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { autorization } = req.headers;

  if (!autorization || !autorization.startsWith('Bearer')) {
    next(new UnauthorizedError('Авторизуйтесь'));
    return;
  }
  const token = autorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-some');
  } catch (err) {
    next(new UnauthorizedError('Авторизуйтесь'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = auth;
