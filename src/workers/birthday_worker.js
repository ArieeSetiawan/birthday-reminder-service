const agenda = require('../config/agenda');
const Users = require('../users/model');
const { calculateNextBirthday } = require('../lib/birthday_calculator');
const config = require('../config/env.js');
const emailLib = require("../lib/email");

agenda.define(
  'send birthday',
  { concurrency: config.workerConcurrency },
  async (job) => {
    const { userId } = job.attrs.data;
    const today = new Date().toISOString().slice(5, 10);
    try {
      const user = await Users.findById(userId);
      if (!user) return;

      const lastDate = new Date(user.birthday).toISOString().slice(5, 10);

      if(lastDate === today){
        console.log(`Happy Birthday ${user.name}`)
        if(config.email.isActive){
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
          }
        }
      }

      let next = calculateNextBirthday(
        user.birthday,
        user.timezone
      );

      if (!next || isNaN(new Date(next))) {
        console.error("Invalid next birthday", userId);
        return;
      }

      const now = new Date();

      if (next <= now) {
        next.setFullYear(next.getFullYear() + 1);
      }

      await agenda.cancel({
        name: 'send birthday',
        'data.userId': userId,
      });

      await agenda.schedule(next, 'send birthday', { userId });

    } catch (err) {
      console.error('Birthday job failed:', err.message);
      throw err;
    }
  }
);