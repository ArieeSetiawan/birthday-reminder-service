const mongoose = require('mongoose');
const config = require('./config/env');
const agenda = require('./config/agenda');

async function startWorker() {
  await mongoose.connect(config.mongoUri);
  console.log('Worker connected to MongoDB');

  await agenda.start();

  require('./workers/birthday_worker');

  console.log('Worker started');
}

startWorker();