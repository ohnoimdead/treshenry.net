var Async        = require('async'),
    Router       = require('../utils/router'),
    ErrorHandler = require('../utils/error_handler'),
    Calendar     = require('../models/calendar'),
    Post         = require('../models/post');

var routes = [
  {
    method:   'get',
    path:     '/calendar',
    callback: function(req, res) {
      var date = new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1);
      if(req.query.year && req.query.month) {
        date = new Date(req.query.year, req.query.month - 1);
      } else if(req.query.month) {
        date = new Date(date.getFullYear(), req.query.month - 1);
      }

      var lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      var cal = Calendar(date.getFullYear(), date.getMonth());

      var query = { private: false };
      if(req.session.user) {
        query = {};
      }

      Async.parallel({
        firstPost: function(callback) {
          Post.findOne({ $query: query, $orderby: { created: 1 }}, callback);
        },
        lastPost: function(callback) {
          Post.findOne({ $query: query, $orderby: { created: -1 }}, callback);
        },
        postsForMonth: function(callback) {
          query.created = { $gt: date, $lt: lastOfMonth };
          console.log(query);
          Post.find(query, callback);
        }
      },
      function(err, results) {
        ErrorHandler(err, res, function() {
          for(var i = 0; i < results.postsForMonth.length; i++) {
            cal.addItem(results.postsForMonth[i].created.getDate(), results.postsForMonth[i]);
          }

          res.render('calendar/calendar.html', {
            title:         "Calendar",
            label:         cal.getDateLabel(),
            weeks:         cal.getLayout(),
            year:          date.getFullYear(),
            previousMonth: date.getMonth(),
            nextMonth:     date.getMonth() + 2,
            hasPrevious:   results.firstPost.created < date,
            hasNext:       results.lastPost.created > lastOfMonth
          });
        });
      });
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
