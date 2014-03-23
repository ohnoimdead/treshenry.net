var Router = require('../utils/router'),
    User   = require('../models/user');

var titles = {
  login:    "Login",
  password: "Change Password"
};

var routes = [
  {
    method:   'get',
    path:     '/login',
    callback: function(req, res) {
      res.render('auth/login', { title: titles.login });
    }
  },
  {
    method:   'post',
    path:     '/login',
    callback: function(req, res) {
      User.login(req.body.username, req.body.password, function(err, user) {
        if(err || !user) {
          res.render('auth/login', { title: titles.login, message: "Unable to authenticate with the given credentials." });
        } else {
          req.session.user = user.username;
          res.redirect('/');
        }
      });
    }
  },
  {
    method:   'get',
    path:     '/logout',
    callback: function(req, res) {
      req.session.user = null;
      res.redirect('/');
    }
  },
  {
    method:     'get',
    path:       '/password',
    authorized: true,
    callback:   function(req, res) {
      res.render('auth/password', { title: titles.password });
    }
  },
  {
    method:     'post',
    path:       '/password',
    authorized: true,
    callback:   function(req, res) {
      if(req.body.new_password != req.body.verify_password) {
        res.render('auth/password', { title: titles.password, message: "Passwords did not match." });
      } else {
        User.login(req.session.user, req.body.old_password, function(err, user) {
          if(err || !user) {
            res.render('auth/password', { title: titles.password, message: "Unable to verify old password." });
          } else {
            user.password = req.body.new_password;
            user.save();
            res.render('auth/password', { title: titles.password, message: "Password changed." });
          }
        });
      }
    }
  }
];

module.exports = function(app) {
  Router(app, routes);
};
