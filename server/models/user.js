const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const skillSchema = new mongoose.Schema({
  fullName: String,
  category: String
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contract: { type: String, required: true },
  location: { type: String },
  professionalTitle: { type: String },
  rating: { type: Number, default: 0 },
  skillsToTeach: [skillSchema],
  skillsToLearn: [skillSchema],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);