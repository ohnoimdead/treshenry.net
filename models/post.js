var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title: String,
  body: String,
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Post', postSchema);
