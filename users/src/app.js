require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route');
const notFoundMiddleware = require('./middlewares/notFound');
const errorHandlerMiddleware = require('./middlewares/errorHandler');

const loadApp = async () => {
  const app = express();

  const rabbitmq = require('./rabbitmq');
  rabbitmq.setup();

  app.use(express.json());
  app.use(bodyParser.json());

  app.use('/api', userRouter);

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};

module.exports = { loadApp };
