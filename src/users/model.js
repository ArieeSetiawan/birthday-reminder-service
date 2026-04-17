const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    birthday: { type: Date, required: true },
    timezone: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    lastBirthdaySentYear: { type: Number, default: null }
  },
  { timestamps: true }
);

userSchema.index({ isDeleted: 1 });
userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: { $ne: true }
    }
  }
);

module.exports = mongoose.model('Users', userSchema);