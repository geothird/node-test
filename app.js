/**
 * Module dependencies.
 */
var express = require('express')
,routes = require('./routes')
,user = require('./routes/user')
,test = require('./routes/test')
,http = require('http')
,path = require('path')
,nib = require('nib')
,stylus = require('stylus')
,global = require('./lib/global').global;

// global default page title
global.setTitle('Test Node App');

var app = express();

// compile stylus assets
function compile(str, path) {
  console.log('Compiling assets.');
  return stylus(str)
    .set('filename', path)
    .use(nib())
 }

// app config
app.configure(function() {
  app.set('port', process.env.PORT || 3002);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'follow the white rabbit'}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile}));
});

// persisted middleware function adds error/success message
app.use(function (req, res, next) {
    var err = req.session.error
        , msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
});

// block unauthorized access
function authorize(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = '403 - Forbidden';
        res.redirect('/signin');
    }
}

// test routes
app.get('/tests', test.list);
app.get('/tests/new', authorize, test.get_new);
app.post('/tests/new', authorize, test.post_new);
app.get('/tests/:id', test.show);
app.get('/tests/:id/edit', authorize, test.edit);
app.post('/tests/:id/update', authorize, test.update);
app.post('/tests/:id/delete', authorize, test.destroy);

// authentication
app.get('/signin', user.signin);
app.post('/signin', user.signin_post);
app.get('/signout', user.signout);

app.get('/users', user.list);

// development error handler
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// root
app.get('/', routes.index);

// load app
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
