let passport = require('passport');
let LocalStrategy = require('passport-local');
let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;
let bcrypt = require('bcrypt');

let User = require('../models/userModel');

passport.use(new LocalStrategy(function(username, password, cb) {
    User.findOne({ username: username })
    .then(user => {
        if (!user) return cb(null, false);

        return bcrypt.compare(password, user.password)
        .then(result => {
            if (result === false) return cb(null, false);
            if (result) return cb(null, user);
        });
    })
    .catch(err => cb(err));
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'this-is-a-secret'
}, function(tokenPayload, cb) {
    console.log('bat')
    User.find({ username: tokenPayload.username })
    .then(user => {
        if (!user) return cb(null, false);
        if (user) return cb(null, user);
    })
    .catch(err => cb(err));
}));