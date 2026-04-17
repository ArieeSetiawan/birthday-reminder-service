const agenda = require('../config/agenda');
const Users = require('../users/model');
const { calculateNextBirthday } = require('../lib/birthday_calculator');
const config = require('../config/env.js');
const emailLib = require("../lib/email");
const { HttpError } = require('../lib/error');

agenda.define(
  'send birthday',
  { concurrency: config.workerConcurrency },
  async (job) => {
    const { userId } = job.attrs.data;
    let user
    try {
      user = await Users.findById(userId);
      if (!user) return;

      const now = new Date();
      const currentYear = now.getFullYear()
      let next = calculateNextBirthday(user.birthday, user.timezone);
      if (!next || isNaN(new Date(next))) {
        console.error("Invalid next birthday", userId);
        return;
      }

      if (next <= now) {
        next.setFullYear(next.getFullYear() + 1);
      }

      if (user.lastBirthdaySentYear === currentYear) {
        console.log(`Already sent for ${user.email}`);
        await agenda.schedule(next, 'send birthday', { userId });
        return;
      }

      const birthday = user.birthday
      const isBirthday =
        birthday.getUTCDate() === now.getUTCDate() &&
        birthday.getUTCMonth() === now.getUTCMonth();

      if (isBirthday) {
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
        user.lastBirthdaySentYear = currentYear;
        await user.save();
      }
      await agenda.schedule(next, 'send birthday', { userId });

    } catch (err) {
      console.error('Birthday job failed:', err.message);
      const failCount = (job.attrs.failCount || 0) + 1;
      if (failCount <= 3) {
        const delay = (failCount + 1) * 60 * 1000

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