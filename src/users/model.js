const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    timezone: { type: String, required: true },
    nextBirthdaySendAt: {type: Date},
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ isDeleted: 1, nextBirthdaySendAt: 1 });

module.exports = mongoose.model('Users', userSchema);