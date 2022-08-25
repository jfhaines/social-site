let Like = require('../models/likeModel');


// CREATE like
module.exports.create = function(req, res, next) {
    let likeInstance = new Like({
        user: req.user._id,
        post: req.parameters.postid
    });

    likeInstance.save()
    .then(() => {
        res.json({ message: 'Successfully liked post', like: likeInstance })
    })
    .catch(err => next(err))
};

// READ all likes
module.exports.readAll = function(req, res, next) {
    Like.find({ post: req.parameters.postid })
    .then(likes => res.json({ count: likes.length, likes}))
    .catch(err => next(err))
};

// DELETE likes
module.exports.delete = function(req, res, next) {
    Like.findByIdAndRemove(req.parameters.likeid)
    .then(() => res.json({
        message: 'Successfully deleted like',
        likeId: req.parameters.likeid
    }))
    .catch(err => next(err))
};