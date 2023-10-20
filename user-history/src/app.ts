import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import rabbitmq from './rabbitmq';
import userHistory from './routes/history.route';

const app = express();
app.use(express.json());
app.use(bodyParser.json());

rabbitmq.setup();

app.use('/api', userHistory);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}...`);
});
