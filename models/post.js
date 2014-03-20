var Mongoose = require('mongoose'),
    Slug     = require('../utils/slug');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title:   { type: String, required: true },
  slug:    { type: String, unique: true },
  body:    { type: String, required: true },
  private: { type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

postSchema.statics.pagedPosts = function(showPrivate, pageNumber, pageSize, callback) {
  var query;
  if(showPrivate) {
    query = this.find({});
  } else {
    query = this.find({ private: false });
  }
  query.sort('-created')
       .skip((pageNumber - 1) * pageSize)
       .limit(pageSize)
       .exec(callback);
};

postSchema.pre('save', function(next) {
  // Sluggify the title
  if(!this.slug) {
    this.slug = Slug(this.title, this.created);
  }
  next();
});

module.exports = Mongoose.model('Post', postSchema);
