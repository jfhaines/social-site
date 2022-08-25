let FriendRequest = require('../models/friendRequestModel');


// CREATE friend request
module.exports.create = function(req, res, next) {
    let friendRequestInstance = new FriendRequest({
        sender: req.user._id,
        receiver: req.body.receiver
    });

    friendRequestInstance.save()
    .then(() => res.json({
        message: 'Friend request created successfully',
        friendRequest: friendRequestInstance
    }))
    .catch(err => next(err))
};

// READ friend request
module.exports.read = function(req, res, next) {
    FriendRequest.findById(req.parameters.friendrequestid).populate(['sender', 'receiver'])
    .then(friendRequest => res.json({ friendRequest }))
    .catch(err => next(err))
};

// READ all friend requests
module.exports.readAll = function(req, res, next) {
    if (String(req.user._id) !== String(req.parameters.userid)) {
        let error = new Error('Access denied');
        error.status = 403;
        return next(error);
    }

    FriendRequest.find({ receiver: req.parameters.userid }).populate(['sender', 'receiver'])
    .then(friendRequests => res.json({ friendRequests }))
    .catch(err => next(err))
};

// DELETE friend request
module.exports.delete = function(req, res, next) {
    FriendRequest.findByIdAndRemove(req.parameters.friendrequestid)
    .then(() => res.json({
        message: 'Successfully deleted friend request',
        friendRequestId: req.parameters.friendrequestid
    }))
    .catch(err => next(err))
};