/* eslint-disable no-unused-vars */
const User = require('../models/user');

const ERROR_INCORRECT = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_CODE = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(ERROR_CODE).send({
      message: 'На сервере произошла ошибка',
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден.' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'CastError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Передан не существующий Id',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_INCORRECT)
          .send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, (name, about), {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, (avatar), {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Пользователь не найден.' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
