const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/env.js');

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

start();