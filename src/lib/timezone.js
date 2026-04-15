const { DateTime } = require('luxon');

const isValidTimezone = (tz) => {
  try {
    DateTime.now().setZone(tz);

    // Luxon returns "Invalid DateTime" if bad zone
    return DateTime.now().setZone(tz).isValid;
  } catch (err) {
    return false;
  }
};