var Router              = require('../utils/router'),
    ValidationFormatter = require('../utils/validation_formatter'),
    ErrorHandler        = require('../utils/error_handler'),
    Post                = require('../models/post');

var titles = {
  new:  "New Post",
  edit: "Edit Post"
};

var routes = [
  {
    method:   'get',
    path:     '/post/:slug',
    callback: function(req, res) {
      var query = { private: false };
      if(req.session.user) {
        query = {};
      }
      query.slug = req.params.slug;

      Post.findOne(query, function(err, post) {
        ErrorHandler(err, res, function() {
          if(post) {
            res.render('posts/post_detail', {
              title: post.title,
              logged_in: req.session.user != null,
              post: post
            });
          } else {
            res.send(404, 'No post found.');
          }
        });
      });
    }
  },
  {
    method:     'get',
    path:       '/post',
    authorized: true,
    callback:   function(req, res) {
      res.render('posts/post_form', { title: titles.new });
    }
  },
  {
    method:     'get',
    path:       '/post/edit/:id',
    authorized: true,
    callback:   function(req, res) {
      Post.findOne({ _id: req.params.id }, function(err, post) {
        ErrorHandler(err, res, function() {
          res.render('posts/post_form', {
            title: titles.edit,
            post: post,
            year: post.created.getFullYear(),
            month: post.created.getMonth() + 1,
            day: post.created.getDate(),
            hour: post.created.getHours(),
            min: post.created.getMinutes()
          });
        });
      });
    }
  },
  {
    method:     'post',
    path:       '/post',
    authorized: true,
    callback:   function(req, res) {
      var post;
      if(req.body.id) {
        // Edit post
        var newDate = new Date(req.body.year, req.body.month - 1, req.body.day, req.body.hour, req.body.minute);
        Post.update({ _id: req.body.id }, {
                      title: req.body.post_title,
                      body: req.body.post_body,
                      private: req.body.private === 'private',
                      created: newDate
        }, function(err, post) {
          if(err) {
            console.log('Error trying to save post:', err);
            res.render('posts/post_form', {
              title: titles.edit,
              post: post,
              message: 'There was an error updating the post.'
            });
          } else {
            res.redirect('/post/' + req.body.slug);
          }
        });
      } else {
        // New post
        var post = new Post({
          title:   req.body.post_title,
          body:    req.body.post_body,
          private: true ? req.body.private === 'private' : false
        });

        post.save(function(err) {
          if(err) {
            post._id = null; // prevent form from thinking the next post is an update

            if(err.name == 'ValidationError') {
              res.render('posts/post_form', {
                title: titles.new,
                post: post,
                message: ValidationFormatter(err.errors)
              });
            } else {
              console.log('Error trying to save post:', err);

              if(err.code = 11000) {
                res.render('posts/post_form', {
                  title: titles.new,
                  post: post,
                  message: 'Duplicate title.'
                });
              } else {
                res.render('posts/post_form', {
                  title: titles.new,
                  post: post,
                  message: 'There was an error creating the post.'
                });
              }
            }
          } else {
            res.redirect('/');
          }
        });
      }
    }
  },
  {
    method: 'delete',
    path:   '/post/delete',
    authorized: true,
    callback: function(req, res) {
      Post.findOne({ _id: req.body.id }, function(err, post) {
        ErrorHandler(err, res, function() {
          post.remove(function(err) {
            if(err) {
              console.log('Error deleting post:', err);
            }
            res.redirect('/');
          });
        });
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
