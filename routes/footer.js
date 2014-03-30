var Router = require('../utils/router'),
    ErrorHandler = require('../utils/error_handler'),
    Footer = require('../models/footer');

var title = 'Edit Footer';

var routes = [
  {
    method:     'get',
    path:       '/footer',
    authorized: true,
    callback:   function(req, res) {
      Footer.findOne({}, function(err, footer) {
        ErrorHandler(err, res, function() {
          res.render('footer/footer_form.html', {
            content: footer.content,
            title: title
          });
        });
      });
    }
  },
  {
    method:     'post',
    path:       '/footer',
    authorized: true,
    callback:   function(req, res) {
      Footer.findOne({}, function(err, footer) {
        ErrorHandler(err, res, function() {
          footer.content = req.body.content;
          footer.save();
          res.redirect('/');
        });
      });
    }
  }
]

module.exports = function(app) {
  Router(app, routes);
};

