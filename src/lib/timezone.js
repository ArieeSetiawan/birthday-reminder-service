const { IANAZone } = require('luxon');

/**
 * Validates IANA timezone string using Luxon.
 *
 * @returns {string} valid timezone
 * @throws validation error if invalid
 */
const validateTimezone = (value, helpers) => {
  if (!IANAZone.isValidZone(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

module.exports = { validateTimezone }