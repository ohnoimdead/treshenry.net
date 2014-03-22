var Mongoose = require('mongoose'),
    Slug     = require('../utils/slug');

var Schema = Mongoose.Schema;

var postSchema = new Schema({
  title:   { type: String, required: true },
  slug:    { type: String, index: true, unique: true },
  body:    { type: String, required: true },
  private: { type: Boolean, default: false },
  created: { type: Date, default: Date.now, index: true }
});

postSchema.statics.pagedPosts = function(showPrivate, date, pageSize, callback) {
  var query = { created: { $lt: date }};

  if(!showPrivate) query.private = false;

  this.find(query)
      .sort('-created')
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

postSchema.set('autoIndex', false);

module.exports = Mongoose.model('Post', postSchema);
