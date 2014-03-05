/*
 * test routes.
 */
var testProvider = require('../lib/test_provider_mongodb').testProvider;
var global = require('../lib/global').global;

exports.list = function (req, res) {
    res.send({});
};

exports.get_new = function (req, res) {
    res.render('test_new.jade', { title: global.getTitle()+' - New Test' });
};

exports.post_new = function (req, res) {
    testProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function (error, docs) {
        res.redirect('/')
    });
};

exports.show = function (req, res) {
    testProvider.findById(req.params.id, function (error, test) {
        res.render('test_show.jade',
        {
          title: global.getTitle()+ ' - ' + test.title, test: test
        });
    });
};

// edit a test
exports.edit = function (req, res) {
    testProvider.findById(req.params.id, function (error, test) {
        res.render('test_edit.jade',
        {
            title: global.getTitle()+' - ' +test.title,
            test: test
        });
    });
};

// update/save
exports.update = function (req, res) {
    testProvider.update(req.param('_id'), {
        title: req.param('title'),
        body: req.param('body')
    }, function (error, docs) {
        res.redirect('/')
    });
};

// delete
exports.destroy = function (req, res) {
    testProvider.delete(req.param('_id'), function (error, tests) {
        res.redirect('/')
    });
};
