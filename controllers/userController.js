let bcrypt = require('bcrypt');
let passport = require('passport');
let jwt = require('jsonwebtoken');
let { body, validationResult } = require('express-validator');
let client = require('../config/redis');

let User = require('../models/userModel');


// Login user
module.exports.login = [
    passport.authenticate('local', { session: false }),

    function(req, res, next) {
        if (req.user) {
            let token = jwt.sign({
                _id: req.user._id, 
                username: req.user.username,
            }, 'this-is-a-secret', { expiresIn: '6h'});

            return res.json({
                userId: req.user._id,
                username: req.user.username,
                message: 'Successful login',
                jwtToken: token
            });
        } else {
            return res.json({ message: 'Login unsuccessful'})
        }
    }
];

// CREATE user
module.exports.create = [
    body('username', 'Must enter a valid username.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Must enter a valid password.').trim().isLength({ min: 6 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors: valErrors });

        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            let userInstance = new User({
                username: req.body.username,
                password: hash
            });
            
            return userInstance.save()
            .then(() => {
                let token = jwt.sign({
                    _id: userInstance._id, 
                    username: userInstance.username,
                }, 'this-is-a-secret', { expiresIn: '6h'});

                res.json({
                    message: 'User created succesfully',
                    userId: userInstance._id,
                    user: userInstance.username,
                    jwtToken: token
                });
            });
        })
        .catch(err => next(err));
    }
];


// READ single user
module.exports.read = function(req, res, next) {
    User.findById(req.parameters.userid).select('username')
    .then(user => res.json({ user }))
    .catch(err => next(err))
};


// READ all users
module.exports.readAll = function(req, res, next) {
    User.find().select('username')
    .then(users => res.json({ users }))
    .catch(err => next(err))
};


// UPDATE user
module.exports.update = [

    body('username', 'Provide a valid username.').trim().isLength({ min: 1 }).escape(),
    body('password', 'Provide a valid password.').trim().isLength({ min: 1 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors: valErrors })

        if (!req.body.password) {
            User.findById(req.parameters.userid)
            .then(user => {
                let userInstance = new User({
                    _id: req.parameters.userid,
                    username: req.body.username ? req.body.username : user.username,
                    password: user.password
                });

                return User.findByIdAndUpdate(req.parameters.userid, userInstance)
                .then(() => {
                    client.set(`bl_${req.jwtToken}`, req.jwtToken)
                    .then(() => client.expireAt(`bl_${req.jwtToken}`, req.user.exp))
                    .catch(err => next(err))
                    
                    let token = jwt.sign({ 
                        _id: userInstance._id, 
                        username: userInstance.username
                    }, 'this-is-a-secret', { expiresIn: '6h'});
        
                    res.json({ 
                        message: 'User updated successfully',
                        userId: userInstance._id,
                        username: userInstance.username,
                        jwtToken: token
                    });
                });
            })
            .catch(err => next(err));

        } else {
            User.findById(req.parameters.userid)
            .then(user => {
                return bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    let userInstance = new User({
                        _id: req.parameters.userid,
                        username: req.body.username ? req.body.username : user.username,
                        password: hash
                    });
        
                    return User.findByIdAndUpdate(req.parameters.userid, userInstance)
                    .then(() => {
                        client.set(`bl_${req.jwtToken}`, req.jwtToken)
                        .then(() => client.expireAt(`bl_${req.jwtToken}`, req.user.exp))
                        .catch(err => next(err))

                        let token = jwt.sign({ 
                            _id: userInstance._id, 
                            username: userInstance.username
                        }, 'this-is-a-secret', { expiresIn: '6h'});
        
                        res.json({ 
                            message: 'User updated successfully',
                            userId: userInstance._id,
                            username: userInstance.username,
                            jwtToken: token
                        });
                    });
                });
            })
            .catch(err => next(err));
        };
    }
];

// DELETE user
module.exports.delete = function(req, res, next) {
    User.findById(req.parameters.userid)
    .then(user => {
        return User.findByIdAndRemove(req.parameters.userid)
        .then(() => {
            client.set(`bl_${req.jwtToken}`, req.jwtToken)
            .then(() => client.expireAt(`bl_${req.jwtToken}`, req.user.exp))
            .catch(err => next(err))

            req.user = undefined;

            res.json({
                message: 'User successfully deleted',
                userId: req.parameters.userid,
                username: user.username
            })
        })
    })
    .catch(err => next(err))
};

// Logout user
module.exports.logout = function(req, res, next) {
    client.set(`bl_${req.jwtToken}`, req.jwtToken)
    .then(() => client.expireAt(`bl_${req.jwtToken}`, req.user.exp))
    .catch(err => next(err))

    res.json({ message: 'Successfully logged out' });
};