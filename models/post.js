var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  created: { type: Date, default: Date.now }
});

postSchema.statics.pagedPosts = function(pageNumber, pageSize, callback) {
  this.find({})
      .sort('-created')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec(callback);
};

module.exports = Mongoose.model('Post', postSchema);
