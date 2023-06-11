const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64844969ccaeaa2039b4942c',
  };

  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('Слушаю порт 3000');
});
