/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const BadRequestError = require('../errors/BadRequestError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .select('+password')
    .then((user) => {
      const token = jwt.sing(
        {
          _id: user._id,
        },
        'some-secret',
      );
      res.cookie('jwt', token, {
        maxAge: 360000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Пользователь не найден.');
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) return res.send({ data: user });
      throw new NotFoundError('Пользователь не найден.');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictRequestError('Пользователь уже существует.'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь не найден.');
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send(user);
      throw new NotFoundError('Пользователь не найден.');
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
