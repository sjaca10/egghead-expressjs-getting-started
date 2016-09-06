var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

var User = require('./db').User;

var router = express.Router({
    mergeParams: true,
});

router.use(function(request, response, next) {
    console.log(request.method, 'for', request.params. username, ' at ', request.path);
    next();
});

router.get('/', function(request, response) {
    var username = request.params.username;
    User.findOne({username: username}, function(err, user){
        response.render('user', {
            user: user,
            address: user.location,
        })
    });
});

router.use(function(err, request, response, next) {
    console.error(err.stack);
    response.status(500).send('Something broke!');
})

router.put('/', function(request, response) {
    var username = request.params.username;
    console.log('here');
    User.findOneAndUpdate({username: username}, {location: request.body}, function(err, user){
        response.end();
    });
});

router.delete('/', function(request, response) {
    var fp = helpers.getUserFilePath(request.params.username);
    fs.unlinkSync(fp); // delete the file
    response.sendStatus(200);
});

module.exports = router;