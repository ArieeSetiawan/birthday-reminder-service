import { DateTime } from "luxon";

export function calculateNextBirthdaySendAt(birthday, timezone) {
  const now = DateTime.now().setZone(timezone);

  const [year, month, day] = birthday.split("-").map(Number);

  let next = DateTime.fromObject(
    {
      year: now.year,
      month,
      day,
      hour: 9,
      minute: 0,
      second: 0,
    },
    { zone: timezone }
  );

  if (next < now) {
    next = next.plus({ years: 1 });
  }

  return next.toUTC().toJSDate();
}