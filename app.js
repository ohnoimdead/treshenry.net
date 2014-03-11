var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    hbs = require('express-hbs');

var config = require('./config'),
    User = require('./models/user'),
    RegisterUserRoutes = require('./routes/user'),
    RegisterAuthRoutes = require('./routes/auth');

var app = express();

// all environments
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('html', hbs.express3({
  partialsDir:   __dirname + '/views/partials',
  layoutsDir:    __dirname + '/views/layouts',
  defaultLayout: __dirname + '/views/layouts/default.html',
  extname:       '.html'
}));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('shouldgetsomesharedsecretfromconfig'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect(config.mongoUri);

// On startup create the default user if it doesn't exist
User.findOne({username: config.defaultUsername}, function(err, defaultUser) {
  if(err) return console.error(err);

  if(!defaultUser) {
    var newDefaultUser = new User({username: config.defaultUsername, password: config.defaultPassword});
    newDefaultUser.save();
  }
});

app.get('/', routes.index);
RegisterUserRoutes(app);
RegisterAuthRoutes(app);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
