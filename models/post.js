var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  created: { type: Date, default: Date.now }
});

module.exports = Mongoose.model('Post', postSchema);
