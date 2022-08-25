let Friend = require('../models/friendModel');


// CREATE friend
module.exports.create = function(req, res, next) {
    let friendInstance = new Friend({
        users: req.body.users
    })

    friendInstance.save()
    .then(() => res.json({
        message: 'Successfully created friends',
        friends: friendInstance
    }))
    .catch(err => next(err))
};

// READ friend
module.exports.read = function(req, res, next) {
    Friend.findById(req.parameters.friendid).populate('users')
    .then(friends => res.json({ friends }))
    .catch(err => next(err))
};

// READ all friends
module.exports.readAll = function(req, res, next) {
    Friend.find({ users: req.parameters.userid }).populate('users')
    .then(friends => res.json({ friends }))
    .catch(err => next(err))
};

// DELETE friend
module.exports.delete = function(req, res, next) {
    Friend.findByIdAndRemove(req.parameters.friendid)
    .then(() => res.json({
        message: 'Successfully deleted friend',
        friendId: req.parameters.id
    }))
    .catch(err => next(err))
};