var _ = require('underscore');

module.exports = function(app, routes) {
  _.each(routes, function(route) {
    app[route.method](route.path, route.callback);
  });
};
