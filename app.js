/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const errorCenter = require('./middlewares/errorCenter');

const app = express();

app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(cookieParser());
app.use(router);

app.use(errors());
app.use(errorCenter);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
