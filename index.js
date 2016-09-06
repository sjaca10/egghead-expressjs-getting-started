var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');

var bodyParser = require('body-parser');

function getUserFilePath(username) {
    return path.join(__dirname, 'users', username) + '.json';
}

function getUser(username) {
    var user = JSON.parse(fs.readFileSync(getUserFilePath(username), {encoding: 'utf8'}));
    user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
    _.keys(user.location).forEach(function (key) {
        user.location[key] = _.startCase(user.location[key]);
    });
    return user;
}

function saveUser(username, data) {
    var fp = getUserFilePath(username);
    fs.unlinkSync(fp) // delete the file
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), {encoding: 'utf8'});
}

app.engine('hbs', engines.handlebars)

app.set('views', './views');
app.set('view engine', 'hbs');

app.use('/profilepics', express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/favicon.ico', function(request, response){
    response.end();
});

app.get('/', function(request, response) {
    var users = [];
    fs.readdir('users', function(err, files){
        files.forEach(function(file) {
            fs.readFile(path.join(__dirname, 'users', file), {encoding: 'utf8'}, function(err, data) {
                var user = JSON.parse(data);
                user.name.full = _.startCase(user.name.first + ' ' + user.name.last);
                users.push(user);
                if(users.length === files.length) response.render('index', {users: users})
            })  ;
        });
    });
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
    var user = getUser(username)
    response.render('user', {
        user: user,
        address: user.location,
    });
});

app.put('/:username', function(request, response) {
    var username = request.params.username;
    var user = getUser(username);
    user.location = request.body;
    saveUser(username, user);
    response.end();
})

app.delete('/:username', function(request, response) {
    var fp = getUserFilePath(request.params.username);
    fs.unlinkSync(fp); // delete the file
    response.sendStatus(200);
})

var server = app.listen(3000, function() {
    console.log('Server running at http://localhost:' + server.address().port);
});