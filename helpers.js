var fs = require('fs');
var path = require('path');
var _ = require('lodash');

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

function verifyUser(request, response, next) {
    var fp = getUserFilePath(request.params.username);

    fs.exists(fp, function(yes) {
        if(yes) {
            next();
        }
        else {
            response.redirect('/error/' + request.params.username);
        }
    });
}

exports.getUser = getUser;
exports.getUserFilePath = getUserFilePath;
exports.saveUser = saveUser;
exports.verifyUser = verifyUser;
