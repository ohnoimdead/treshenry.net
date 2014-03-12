var _ = require('underscore');

module.exports = function(app, routes) {
  _.each(routes, function(route) {
    if(!route.authorized) {
      app[route.method](route.path, route.callback);
    } else {
      app[route.method](route.path, function(req, res) {
        // If a user is stored in the session we consider them authorized.
        // This is obviously somewhat weak security, but it'll do for now.
        if(req.session.user) {
          route.callback(req, res);
        } else {
          // Mimic the defaul express 404 error
          res.send("Cannot " + route.method.toUpperCase() + " " + route.path, 404);
        }
      });
    }
  });
};
