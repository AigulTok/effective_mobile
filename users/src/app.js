require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const userRouter = require('./routes/user.route');
const app = express();

const rabbitmq = require('./rabbitmq');
rabbitmq.setup();

app.use(express.json());
app.use(bodyParser.json());

app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
