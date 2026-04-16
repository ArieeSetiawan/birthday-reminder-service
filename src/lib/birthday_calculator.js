const { DateTime } = require("luxon");
const agenda = require("../config/agenda");

function calculateNextBirthday(birthday, timezone) {
  const now = DateTime.now().setZone(timezone);
  
  const date = DateTime.fromJSDate(birthday).setZone(timezone);

  let next = date.set({
    year: now.year,
    hour: process.env.BIRTHDAY_HOUR || 9,
    minute: 0,
    second: 0,
  });

  if (next <= now) {
    next = next.plus({ years: 1 })
  }

  return next.toUTC().toJSDate();
}

async function scheduleBirthday(user) {
  const next = calculateNextBirthday(
    user.birthday,
    user.timezone
  );

  if (!next || isNaN(new Date(next))) {
  console.error("Invalid next birthday date", user.id);
  return;
}

  await agenda.cancel({ "data.userId": user._id });

  await agenda.schedule(next, "send birthday", {
    userId: user._id,
  });
}

module.exports = {
  calculateNextBirthday,
  scheduleBirthday,
};