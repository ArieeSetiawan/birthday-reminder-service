const agenda = require('../config/agenda');
const Users = require('../users/model');
const { calculateNextBirthday } = require('../lib/birthday_calculator');
const config = require('../config/env.js');
const emailLib = require("../lib/email");
const { HttpError } = require('../lib/error');
const { DateTime } = require("luxon");

agenda.define(
  'send birthday',
  { concurrency: config.workerConcurrency },
  async (job) => {
    const { userId } = job.attrs.data;
    let user
    try {
      user = await Users.findById(userId);
      if (!user) return;

      const now = DateTime.now().setZone(user.timezone);
      const currentYear = now.year

      let next = calculateNextBirthday(user.birthday, user.timezone);
      if (!next || isNaN(new Date(next))) {
        console.error("Invalid next birthday", userId);
        return;
      }

      let nextDt = DateTime.fromJSDate(next).setZone(user.timezone);

      if (nextDt <= now) {
        nextDt = nextDt.plus({ years: 1 });
        next = nextDt.toUTC().toJSDate();
      }

      if (user.lastBirthdaySentYear === currentYear) {
        console.log(`Already sent for ${user.email}`);
        await agenda.schedule(next, 'send birthday', { userId });
        return;
      }

      const birthday = DateTime.fromJSDate(user.birthday).setZone(user.timezone);
      const startOfBirthday = now.set({
        month: birthday.month,
        day: birthday.day,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      const endOfBirthday = startOfBirthday.plus({ days: 1 });

      const isBirthday = now >= startOfBirthday && now < endOfBirthday;

      if (isBirthday) {
        const updated = await Users.findOneAndUpdate(
          {
            _id: userId,
            lastBirthdaySentYear: { $ne: currentYear }
          },
          {
            $set: { lastBirthdaySentYear: currentYear }
          }
        );

        if (!updated) {
          console.log(`Skipped due to atomic lock (already handled or locked) ${user.email}`)
          return;
        }
        console.log(`Happy Birthday ${user.name}`);
        if (config.email.isActive) {
          try{
            await emailLib.sendEmail({
              to: user.email,
              subject: `Happy Birthday ${user.name}`,
              text: `Happy Birthday ${user.name} wish you all the best`
            })
            console.log(`Success Send Email ${user.email}`)
          }catch(err){
            console.log(err)
            console.error(`Fail Send Email ${user.email}`)
            throw err
          }
        }
      }
      await agenda.schedule(next, 'send birthday', { userId });

    } catch (err) {
      console.error('Birthday job failed:', err.message);
      const failCount = (job.attrs.failCount || 0) + 1;
      if (failCount <= 3) {
        const baseDelay = 60 * 1000
        const delay = Math.pow(2, failCount - 1) * baseDelay

        console.log(`Retrying in ${delay / 1000}s (attempt ${failCount + 1})`);

        job.fail(err)

        await job.schedule(new Date(Date.now() + delay));
        await job.save();
        return
      } else {
        console.error(`Max retries reached for user ${userId}`);
        if (user) {
          let next = calculateNextBirthday(user.birthday, user.timezone);
          if (next) {
            await agenda.schedule(next, 'send birthday', { userId });
          }
        }
        return
      }
    }
  }
);