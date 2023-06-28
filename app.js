const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorCenter = require('./middlewares/errorCenter');
const auth = require('./middlewares/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(auth);

app.use(router);

app.use(errorCenter);

app.use(errors());

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
