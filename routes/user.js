var User         = require('../models/user'),
    ErrorHandler = require('../utils/error_handler'),
    Router       = require('../utils/router');

var routes = [
  {
    method: 'get',
    path: '/users',
    callback: function(req, res) {
      User.find({}, { username: 1, created: 1, _id: 0 }, function(err, users) {
        ErrorHandler(err, res, function() {
          res.send(users);
        });
      });
    }
  },
  {
    method: 'get',
    path: '/user',
    callback: function(req, res) {
      if(req.session.user) {
        res.send({'current_user': req.session.user});
      } else {
        res.send({});
      }
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
