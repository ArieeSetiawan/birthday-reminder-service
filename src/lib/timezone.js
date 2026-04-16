const { IANAZone } = require('luxon');

const validateTimezone = (value, helpers) => {
  if (!IANAZone.isValidZone(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = { validateTimezone }