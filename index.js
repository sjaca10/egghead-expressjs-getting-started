var express = require('express');
var app = express();

var fs = require('fs');
var _ = require('lodash');
var engines = require('consolidate');

var users = [];

fs.readFile('users.json', {encoding: 'utf8'}, function(err, data){
    if (err) throw err

    JSON.parse(data).forEach(function(user) {
        user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
        users.push(user);
    });
});

app.engine('hbs', engines.handlebars)

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profilepics', express.static('images'));


app.get('/', function(request, response) {
    response.render('index', {users: users})
});

app.get(/big.*/, function(request, response, next) {
    console.log('BIG USER ACCESS');
    next();
});

app.get(/.*dog.*/, function(request, response, next) {
    console.log('DOGS GO WOOF');
    next();
})

app.get('/:username', function(request, response) {
    var username = request.params.username;
    response.render('user', {username: username})
});

var server = app.listen(3000, function() {
    console.log('Server running at http://localhost:' + server.address().port);
});