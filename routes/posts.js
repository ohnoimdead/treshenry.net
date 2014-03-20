var Router              = require('../utils/router'),
    Post                = require('../models/post'),
    ValidationFormatter = require('../utils/validation_formatter');

var titles = {
  new:  "New Post",
  edit: "Edit Post"
};

var routes = [
  {
    method:   'get',
    path:     '/post/:slug',
    callback: function(req, res) {
      Post.findOne({ slug: req.params.slug }, function(err, post) {
        if(err) {
          console.log('Error getting post:', err);
          res.send(404, "Unable to find post.");
        } else {
          res.render('posts/post_detail', {
            title: post.title,
            logged_in: req.session.user != null,
            post: post
          });
        }
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
        if(err) {
          console.log('Error editing post:', err);
          res.render('posts/post_form', { title: titles.edit, message: 'There was an error getting the post.' });
        } else {
          res.render('posts/post_form', { title: titles.edit, post: post });
        }
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
        Post.update({ _id: req.body.id }, { title: req.body.post_title, body: req.body.post_body, private: req.body.private === 'private' }, function(err, post) {
          if(err) {
            console.log('Error trying to save post:', err);
            res.render('posts/post_form', {
              title: titles.edit,
              post: post,
              message: 'There was an error updating the post.'
            });
          } else {
            res.redirect('/');
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
        if(err) {
          console.log('Error deleting post:', err);
          res.redirect('/');
        } else {
          post.remove(function(err) {
            if(err) {
              console.log('Error deleting post:', err);
            }
            res.redirect('/');
          });
        }
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
