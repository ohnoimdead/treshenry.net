var Moment = require('moment');

module.exports = function(hbs) {
  hbs.registerHelper('moment-long', function(date) {
    return Moment(date).format('dddd, MMMM D, YYYY');
  });

  hbs.registerHelper('moment-ago', function(date) {
    return Moment(date).fromNow();
  });
}
