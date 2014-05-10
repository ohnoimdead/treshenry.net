var Express    = require('express'),
    Http       = require('http'),
    Path       = require('path'),
    Mongoose   = require('mongoose'),
    Hbs        = require('express-hbs'),
    MongoStore = require('connect-mongo')(Express);

var Config                 = require('./config'),
    User                   = require('./models/user'),
    Footer                 = require('./models/footer'),
    RegisterIndexRoutes    = require('./routes/index'),
    RegisterAuthRoutes     = require('./routes/auth'),
    RegisterUserRoutes     = require('./routes/users'),
    RegisterFooterRoutes   = require('./routes/footer'),
    RegisterPostRoutes     = require('./routes/posts'),
    RegisterCalendarRoutes = require('./routes/calendar'),
    MarkdownHelper         = require('./views/helpers/markdown'),
    FooterHelper           = require('./views/helpers/footer'),
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

// Use mongodb for sessions
app.use(Express.session({
  secret: Config.secret,
  store: new MongoStore({
    url: Config.mongoUri
  })
}));

app.use(app.router);
app.use(require('less-middleware')({ src: Path.join(__dirname, 'public') }));
app.use(Express.static(Path.join(__dirname, 'public')));

// Register helpers
MarkdownHelper(Hbs);
FooterHelper(Hbs);
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

// Also on startup create the default footer if it doesn't exist
Footer.findOne({}, function(err, footer) {
  if(err) return console.error(err);

  if(!footer) {
    var footer = new Footer({
      content: '<div class="copyright">Copyright &copy; Tres Henry. All rights reserved.</div>'
    });
    footer.save();
  }
});

// Register routes
RegisterIndexRoutes(app);
RegisterAuthRoutes(app);
RegisterUserRoutes(app);
RegisterFooterRoutes(app);
RegisterPostRoutes(app);
RegisterCalendarRoutes(app);

Http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
