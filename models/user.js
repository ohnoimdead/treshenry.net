var Mongoose = require('mongoose'),
    Crypto   = require('crypto'),
    Config   = require('../config');

var Schema = Mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String, // TODO: salt and hash
  created: { type: Date, default: Date.now }
});

function hashPassword(password, salt) {
  var c = Crypto.createHash('sha256');
  c.update(password + salt);
  return c.digest('hex');
}

userSchema.statics.login = function(username, password, callback) {
  password = hashPassword(password, Config.salt);
  this.findOne({username: username, password: password}, callback);
};

// Hash the password yo - we don't store clear text passwords do we? No. We don't.
userSchema.pre('save', function(next) {
  // TODO need some way to know if password is already encrypted
  // right now the consumer of this model needs to do the right thing
  // which is fine because the only times a user is saved is on create
  // and on password change.
  this.password = hashPassword(this.password, Config.salt);
  next();
});

module.exports = Mongoose.model('User', userSchema);
