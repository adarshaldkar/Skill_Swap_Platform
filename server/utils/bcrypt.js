// utils/bcrypt.js
const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.comparePasswords = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};