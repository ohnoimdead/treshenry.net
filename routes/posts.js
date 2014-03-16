var Router              = require('../utils/router'),
    Post                = require('../models/post'),
    ValidationFormatter = require('../utils/validation_formatter');

var titles = {
  new: "New Post"
};

var routes = [
  {
    method:     'get',
    path:       '/post',
    authorized: true,
    callback:   function(req, res) {
      res.render('posts/post_form', { title: titles.new });
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
        Post.update({ _id: req.body.id }, { title: req.body.post_title, body: req.body.post_body, private: req.body.private === 'private' }, function(err) {
          if(err) {
            console.log('Error trying to save post: ', err);
            res.render('posts/post_form', { title: titles.new, message: 'There was an error creating the post.' });
          } else {
            res.redirect('/');
          }
        });
      } else {
        // New post
        post = new Post({
          title:   req.body.post_title,
          body:    req.body.post_body,
          private: true ? req.body.private === 'private' : false
        });

        post.save(function(err) {
          if(err) {
            if(err.name == 'ValidationError') {
              res.render('posts/post_form', { title: titles.new, message: ValidationFormatter(err.errors) });
            } else {
              console.log('Error trying to save post: ', err);
              res.render('posts/post_form', { title: titles.new, message: 'There was an error creating the post.' });
            }
          } else {
            res.redirect('/');
          }
        });
      }
    }
  },
  {
    method:     'get',
    path:       '/post/edit/:id',
    authorized: true,
    callback:   function(req, res) {
      Post.findOne({ _id: req.params.id }, function(err, post) {
        if(err) {
          console.log('Error editing post: ', err);
          res.render('posts/post_form', { title: titles.edit, message: 'There was an error editing the post.' });
        } else {
          res.render('posts/post_form', { title: titles.edit, post: post });
        }
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
