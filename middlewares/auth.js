// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.name = process.env.AU;
    next(err);
  }
  req.user = payload;
  next();
};

module.exports = auth;
