import Users from "../models/User.js";
import { DateTime } from "luxon";

export async function runBirthdayWorker() {
  const now = DateTime.utc();

  const users = await Users.find({
    nextBirthdaySendAt: { $lte: now.toJSDate() },
  });

  if (!users.length) {
    console.log("🎂 No birthday users to process");
    return;
  }

  for (const user of users) {
    try {
      console.log(`🎉 Sent birthday to ${user.name}`);

      // recalculate next send time
      const next = calculateNextBirthdaySendAt(
        user.birthday,
        user.timezone
      );

      user.nextBirthdaySendAt = next;
      await user.save();
    } catch (err) {
      console.error(`❌ Failed for ${user.name}`, err.message);
    }
  }
}