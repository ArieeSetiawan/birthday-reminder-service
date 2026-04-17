require('dotenv').config();

function mustGet(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
}

const emailActive = process.env.EMAIL_IS_ACTIVE === 'true';

const env = {
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  mongoUri: mustGet('MONGO_URI'),
  birthdayHour: parseInt(process.env.BIRTHDAY_HOUR || '9', 10),
  workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '1', 10),
  email: emailActive
    ? {
        isActive: true,
        host: mustGet('EMAIL_HOST'),
        port: parseInt(mustGet('EMAIL_PORT'), 10),
        user: mustGet('EMAIL_USER'),
        pass: mustGet('EMAIL_PASS'),
      }
    : {
        isActive: false,
      },
};

module.exports = env;