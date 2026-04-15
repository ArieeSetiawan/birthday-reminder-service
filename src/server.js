const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env.js');

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(console.error);