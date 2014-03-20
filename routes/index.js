var Router = require('../utils/router'),
    Config = require('../config'),
    Post   = require('../models/post');

var routes = [
  {
    method: 'get',
    path: '/',
    callback: function(req, res) {
      Post.pagedPosts(req.session.user != null, 1, 100, function(err, posts) {
        if(err) {
          console.log('Error getting posts: ', err);
          res.render('index', {
            title: Config.siteTitle,
            message: 'Error getting posts.'
          });
        } else {
          res.render('index', {
            title: Config.siteTitle,
            logged_in: req.session.user != null,
            posts: posts
          });
        }
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
