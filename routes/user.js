/*
 * GET users listing.
 */
var hash = require('../lib/pass').hash;
var global = require('../lib/global').global;

// dummy test database
var users = {
    testuser: { name: 'testuser' }
};

exports.list = function (req, res) {
    res.send({});
};

// create a hash and salt
hash('testpass', function(err, salt, hash){
    if (err) throw err;
    users.testuser.salt = salt;
    users.testuser.hash = hash;
});

// auth user
function auth(name, pass, fn) {
    if (!module.parent) console.log('authorizing %s:%s', name, pass);
    var user = users[name];
    // query the db for the given username
    if (!user) return fn(new Error('Unknown User'));
    hash(pass, user.salt, function(err, hash){
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('Invalid username/password.'));
    })
}

// signout of app
exports.signout = function(req, res){
    // destroy the user's session to log them out
    req.session.destroy(function(){
        res.redirect('/');
    });
};

// [GET] signin to app view
exports.signin = function(req, res){
    res.render('signin.jade', { title: global.getTitle(), locals: res.locals});
};

// [POST] signin to app
exports.signin_post = function(req, res){
    auth(req.param('username'), req.param('password'), function(err, user){
        if (user) {
            req.session.regenerate(function(){
                req.session.user = user;
                res.redirect('/');
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/signout">logout</a>. '
                    + ' You may now access <a href="/tests/new">New Test</a>.';
            });
        } else {
            req.session.error = '403 - Forbidden';
            res.redirect('signin');
        }
    });
};
