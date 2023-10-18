require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}...`);
});
