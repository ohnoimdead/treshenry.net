var Moment = require('moment');

module.exports = function(hbs) {
  hbs.registerHelper('moment-long', function(date) {
    return Moment(date).format('LLLL');
  });

  hbs.registerHelper('moment-ago', function(date) {
    return Moment(date).fromNow();
  });
};
