var Db = require('mongodb').Db;
var Server = require('mongodb').Server;

TestProvider = function(host, port) {
  this.db= new Db('node-mongo-test', new Server(host, port, {auto_reconnect: true}, {}),{safe:false});
  this.db.open(function(){});
};


TestProvider.prototype.getCollection= function(callback) {
  this.db.collection('tests', function(error, test_collection) {
    if( error ) callback(error);
    else callback(null, test_collection);
  });
};

TestProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, test_collection) {
      if( error ) callback(error)
      else {
        var sort = {created_at: -1};
        test_collection.find().sort(sort).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

TestProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, test_collection) {
      if( error ) callback(error)
      else {
        test_collection.findOne({_id: test_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

TestProvider.prototype.save = function(tests, callback) {
    this.getCollection(function(error, test_collection) {
      if( error ) callback(error)
      else {
        if( typeof(tests.length)=="undefined")
          tests = [tests];

        for( var i =0;i< tests.length;i++ ) {
          var test = tests[i];
          test.created_at = new Date();
          test.updated_at = new Date();
          if( test.comments === undefined ) test.comments = [];
          for(var j =0;j< test.comments.length; j++) {
            test.comments[j].created_at = new Date();
          }
        }

        test_collection.insert(tests, function() {
          callback(null, tests);
        });
      }
    });
};

TestProvider.prototype.delete = function(testId, callback) {
    this.getCollection(function(error, test_collection) {
        if(error) callback(error);
        else {
            test_collection.remove(
                {_id: test_collection.db.bson_serializer.ObjectID.createFromHexString(testId)},
                function(error, test){
                    if(error) callback(error);
                    else callback(null, test)
                });
        }
    });
};

TestProvider.prototype.update = function(testId, tests, callback) {
    this.getCollection(function(error, test_collection) {
        if( error ) callback(error);
        else {
            for( var i =0;i< tests.length;i++ ) {
                var test = tests[i];
                test.updated_at = new Date();
                test.body = test.body.split('\r\n\r\n');
            }

            test_collection.update(
                {_id: test_collection.db.bson_serializer.ObjectID.createFromHexString(testId)},
                tests,
                function(error, tests) {
                    if(error) callback(error);
                    else callback(null, tests)
                });
        }
    });
};

TestProvider.instance = null;
TestProvider.getInstance = function () {
    if(this.instance === null) {
       this.instance = new TestProvider('localhost', 27017);
    }
    return this.instance;
}

exports.TestProvider = TestProvider;
exports.testProvider = TestProvider.getInstance();
