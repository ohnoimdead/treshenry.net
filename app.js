var Express  = require('express'),
    Http     = require('http'),
    Path     = require('path'),
    Mongoose = require('mongoose'),
    Hbs      = require('express-hbs');

var Config                 = require('./config'),
    User                   = require('./models/user'),
    RegisterIndexRoutes    = require('./routes/index'),
    RegisterAuthRoutes     = require('./routes/auth'),
    RegisterUserRoutes     = require('./routes/users'),
    RegisterPostRoutes     = require('./routes/posts'),
    RegisterCalendarRoutes = require('./routes/calendar'),
    MarkdownHelper         = require('./views/helpers/markdown'),
    MomentHelpers          = require('./views/helpers/moment');

var app = Express();

// all environments
// Use `.hbs` for extensions and find partials in `views/partials`.
app.engine('html', Hbs.express3({
  partialsDir:   __dirname + '/views/partials',
  layoutsDir:    __dirname + '/views/layouts',
  defaultLayout: __dirname + '/views/layouts/default.html',
  extname:       '.html'
}));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 3000);
app.use(Express.logger('dev'));
app.use(Express.json());
app.use(Express.urlencoded());
app.use(Express.methodOverride());
app.use(Express.cookieParser(Config.secret));
app.use(Express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: Path.join(__dirname, 'public') }));
app.use(Express.static(Path.join(__dirname, 'public')));

// Register helpers
MarkdownHelper(Hbs);
MomentHelpers(Hbs);

// development only
if('development' == app.get('env')) {
  app.use(Express.errorHandler());
}

Mongoose.connect(Config.mongoUri);

// On startup create the default user if it doesn't exist
User.findOne({username: Config.defaultUsername}, function(err, defaultUser) {
  if(err) return console.error(err);

  if(!defaultUser) {
    var newDefaultUser = new User({
      username: Config.defaultUsername,
      password: Config.defaultPassword
    });
    newDefaultUser.save();
  }
});

// Register routes
RegisterIndexRoutes(app);
RegisterAuthRoutes(app);
RegisterUserRoutes(app);
RegisterPostRoutes(app);
RegisterCalendarRoutes(app);

Http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
