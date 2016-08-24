const mongoose = require('./db');
const Schema = mongoose.Schema;

const userSchema = new Schema( {
  userName: String,
  userID: String
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
