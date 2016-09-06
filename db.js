var uri = 'mongodb://localhost:27017/test';

/**
var MongoClient = require('mongodb').MongoClient;

var findUsers = function(db, callback) {
    var cursor = db.collection('users').find();
    cursor.each(function(err, doc) {
        if (err) throw err;
        if(doc != null) {
            console.dir(doc)
        }
        else {
            callback();
        }
    });
}

MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    findUsers(db, function() {
        db.close();
    });
});
**/

var _ = require('lodash');
var mongoose = require('mongoose');
mongoose.connect(uri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('db connected');
});

var userSchema = mongoose.Schema({
    username: String,
    gender: String,
    name: {
        title: String,
        first: String,
        last: String,
    },
    location: {
        street: String,
        city: String,
        state: String,
        zip: Number,
    }
});

userSchema.virtual('name.full').get(function() {
    return _.startCase(this.name.first + ' ' + this.name.last);
});

userSchema.virtual('name.full').set(function(value) {
    var bits = value.split(' ');
    this.name.first = bits[0];
    this.name.last = bits[1];
});

exports.User = mongoose.model('User', userSchema);

// exports.User.find({}, function(err, users){
//     console.log(users);
// });
