var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var footerSchema = new Schema({
  content: String,
  updated: { type: Date, default: Date.now },
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Footer', footerSchema);
