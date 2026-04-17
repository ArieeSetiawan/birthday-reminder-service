const Joi = require('joi');
const { validateTimezone } = require('../lib/timezone');

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  birthday: Joi.date().iso().required(),
  timezone: Joi.string().required().custom(validateTimezone)
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  birthday: Joi.date().iso(),
  timezone: Joi.string().custom(validateTimezone)
}).min(1);

module.exports = { createUserSchema, updateUserSchema };