var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  private: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

postSchema.statics.pagedPosts = function(showPrivate, pageNumber, pageSize, callback) {
  var query;
  if(showPrivate) {
    query = this.find({});
  } else {
    query = this.find({private: false});
  }
  query.sort('-created')
       .skip((pageNumber - 1) * pageSize)
       .limit(pageSize)
       .exec(callback);
};

module.exports = Mongoose.model('Post', postSchema);
