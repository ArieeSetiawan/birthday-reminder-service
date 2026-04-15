require('dotenv').config();

function mustGet(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: mustGet('MONGO_URI'),
  cron: process.env.CHECK_INTERVAL_CRON || '* * * * *',
  birthdayHour: parseInt(process.env.BIRTHDAY_HOUR || '9', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = env;