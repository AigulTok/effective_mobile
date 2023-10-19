require('dotenv').config();

const express = require('express');
const port = process.env.PORT || 8000;
const userRouter = require('./routes/user.route');

const app = express();
app.use(express.json());

app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
