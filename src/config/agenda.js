const Agenda = require('agenda');
const config = require('./env.js');

const agenda = new Agenda({
  db: {
    address: config.mongoUri,
    collection: "agendaJobs",
  },
  processEvery: "10 seconds",
});

module.exports = agenda;