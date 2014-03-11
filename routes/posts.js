var Router = require('../utils/router'),
    Post   = require('../models/post');

var routes = [
  {
    method: 'get',
    path: '/post',
    callback: function(req, res) {
      res.render('posts/post_form');
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
