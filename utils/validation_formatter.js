var _ = require('underscore');

module.exports = function(errors) {
  return 'Validation errors: ' + _.map(errors, function(error) { return error.message }).join(' ');
}

