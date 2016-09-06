var express = require('express');
var app = express();

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var engines = require('consolidate');
// var helpers = require('./helpers');

var JSONStream = require('JSONStream');
var bodyParser = require('body-parser');

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
    fs.readdir('users', function(err, files) {
        if(err) throw err;
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

app.get('*.json', function(request, response) {
    response.download('./users/' + request.path, 'virus.exe');
});

app.get('/data/:username', function(request, response) {
    var username = request.params.username;
    var readable = fs.createReadStream('./users/' + username + '.json');
    readable.pipe(response)
});

app.get('/users/by/:gender', function(request, response) {
    var gender = request.params.gender;
    var readable = fs.createReadStream('users.json');

    readable
        .pipe(JSONStream.parse('*', function(user){
            if(user.gender === gender) return user;
        }))
        .pipe(JSONStream.stringify('[\n ',', \n ','\n]\n'))
        .pipe(response);
});

app.get('/error/:username', function(request, response) {
    response.status(404).send('No user named ' + request.params.username + ' found');
});

var userRouter = require('./username');
app.use('/:username', userRouter);

var server = app.listen(3000, function() {
    console.log('Server running at http://localhost:' + server.address().port);
});