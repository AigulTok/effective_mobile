require('dotenv').config();

const { loadApp } = require('./app.js');
const port = process.env.PORT || 8000;

const startApp = async () => {
  const app = await loadApp();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
  });
};

startApp();
