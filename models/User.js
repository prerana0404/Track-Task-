const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  country: String,
});

module.exports = mongoose.model('User', UserSchema);
