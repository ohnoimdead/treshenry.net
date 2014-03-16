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
      var post = new Post({
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
];

module.exports = function(app) {
  Router(app, routes);
};
