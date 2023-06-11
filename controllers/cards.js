/* eslint-disable no-unused-vars */
const Card = require('../models/card');

const ERROR_INCORRECT = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_CODE = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(ERROR_CODE).send({
      message: 'На сервере произошла ошибка',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Переданы не корректные данные.',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Такой карточки не существует.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Передан не сущетвующий Id',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Такой карточки не существует.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Передан не сущетвующий Id',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(500).send({ message: 'Такой карточки не существует.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_INCORRECT).send({
          message: 'Передан не сущетвующий Id',
        });
        return;
      }
      res.status(ERROR_CODE).send({
        message: 'На сервере произошла ошибка',
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
