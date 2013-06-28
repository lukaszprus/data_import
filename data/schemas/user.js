var mongoose = require('mongoose');
var request = require('request');

var emailRegexp = /.+\@.+\..+/;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    name: mongoose.Schema.Types.Mixed,
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: emailRegexp
    },
    gender: {
        type: String,
        required: true,
        uppercase: true,
            'enum': ['M', 'F']
    },
    birthday: {
        type: Date,
        validate: [
        validate_18_years_old_or_more,
            'You must be 18 years old or more']
    },
    twitter: {
        type: String,
        lowercase: true,
        validate: [twitterHandleExists, 'Please provide a valid twitter handle'],
        set: filterTwitterHandle,
        get: filterTwitterHandle
    },

    meta: {
        created_at: {
            type: Date,
                'default': Date.now,
            set: function (val) {
                return undefined;
            }
        },
        updated_at: {
            type: Date,
                'default': Date.now
        }
    }

});

UserSchema.virtual('twitter_url')
    .get(function () {
    if (this.twitter) {
        return 'http://twitter.com/' + encodeURIComponent(this.twitter);
    }
});

UserSchema.virtual('full_name')
    .get(function () {
    if (typeof this.name === 'string') {
        return this.name;
    }
    return [this.name.first, this.name.last].join(' ');
})
    .set(function (fullName) {
    var nameComponents = fullName.split(' ');
    this.name = {
        last: nameComponents.pop(),
        first: nameComponents.join(' ')
    };
});

/* UserSchema.methods.recentArticles = function (callback) {
    return this.model('Article')
        .find({
        author: this._id
    })
        .sort('created_at')
        .limit(5)
        .exec(callback);
}; */


module.exports = UserSchema;

var TIMESPAN_YEAR = 31536000000;
var TIMESPAN_18_YEARS = 18 * TIMESPAN_YEAR;

function validate_18_years_old_or_more(date) {
    return (Date.now() - date.getTime()) > TIMESPAN_18_YEARS;
}

function twitterHandleExists(handle, done) {
    request('http://twitter.com/' + encodeURIComponent(handle), function (err, res) {
        if (err) {
            console.error(err);
            return done(false);
        }
        if (res.statusCode > 299) {
            done(false);
        } else {
            done(true);
        }
    });
}

function filterTwitterHandle(handle) {
    if (!handle) {
        return;
    }
    handle = handle.trim();
    if (handle.indexOf('@') === 0) {
        handle = handle.substring(1);
    }
    return handle;
}