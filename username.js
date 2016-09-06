var express = require('express');
var helpers = require('./helpers');
var fs = require('fs');

var router = express.Router({
    mergeParams: true,
});

router.use(function(request, response, next) {
    console.log(request.method, 'for', request.params. username, ' at ', request.path);
    next();
});

router.get('/', helpers.verifyUser, function(request, response) {
    var username = request.params.username;
    var user = helpers.getUser(username)
    response.render('user', {
        user: user,
        address: user.location,
    });
});

router.use(function(err, request, response, next) {
    console.error(err.stack);
    response.status(500).send('Something broke!');
})

router.put(function(request, response) {
    var username = request.params.username;
    var user = helpers.getUser(username);
    user.location = request.body;
    helpers.saveUser(username, user);
    response.end();
});

router.delete('/', function(request, response) {
    var fp = helpers.getUserFilePath(request.params.username);
    fs.unlinkSync(fp); // delete the file
    response.sendStatus(200);
});

module.exports = router;