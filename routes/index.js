var Router = require('../utils/router'),
    Config = require('../config'),
    Post   = require('../models/post');

var routes = [
  {
    method: 'get',
    path: '/',
    callback: function(req, res) {
      var marker = new Date(); // Default to showing most recent

      // But if we have a marker passed in (i.e. we are paging back) then
      // use that for the date instead.
      if(req.query.marker) marker = new Date(parseInt(req.query.marker, 10));

      Post.pagedPosts(req.session.user != null, marker, Config.pageSize, function(err, posts) {
        if(err) {
          console.log('Error getting posts: ', err);
          res.render('index', {
            title: Config.siteTitle,
            message: 'Error getting posts.'
          });
        } else {

          var context = {
            title: Config.siteTitle,
            logged_in: req.session.user != null,
            posts: posts
          };

          if(posts.length > 0) {
            context.date_marker = posts[posts.length - 1].created.getTime();
          }

          res.render('index', context);
        }
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
