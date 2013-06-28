var mongoose = require('mongoose');
var User = require('./data/models/user');

mongoose.connect('mongodb://admin:xxxxxx@dharma.mongohq.com:10073/lucasprus');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function callback() {
    var fileJSON = require('./data/dataJun-28-2013_simple.json');
    // console.log(fileJSON);
    console.log(fileJSON[0]);
    console.log(typeof fileJSON[0]);
    console.log('Connected to database\n');

    User.create(fileJSON, function (err) {
        if (err) console.log(err.name);
    });

});