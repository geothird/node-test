/*
 * index routes
 */
var testProvider = require('../lib/test_provider_mongodb').testProvider;
var global = require('../lib/global').global;

exports.index = function(req, res){
    testProvider.findAll(function(error, tests){
        res.render('index', { title: global.getTitle(), tests: tests });
    });
};
