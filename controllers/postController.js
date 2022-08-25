let { body, validationResult } = require('express-validator');

let Post = require('../models/postModel');


// Create
module.exports.create = [
    body('content', 'Requires valid text.').trim().isLength({ min: 1 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors });

        let postInstance = new Post({
            content: req.body.content,
            user: req.user._id,
            date: Date.now()
        });

        postInstance.save()
        .then(() => res.json({ message: 'Post created successfully', postInstance }))
        .catch(err => next(err))
    }
];

// Read
module.exports.read = function(req, res, next) {
    Post.findById(req.parameters.postid)
    .then(post => res.json({ post }))
    .catch(err => next(err))
};

// Read all
module.exports.readAll = function(req, res, next) {
    Post.find()
    .then(posts => res.json({ posts }))
    .catch(err => next(err))
};

// Update
module.exports.update = [
    body('content', 'Requires valid text.').trim().isLength({ min: 1 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors });

        Post.findById(req.parameters.postid).populate('user')
        .then(post => {
            if (String(req.user._id) !== String(post.user._id)) {
                let error = new Error('Not permitted to update.');
                error.status = 403;
                return next(error)
            } else {
                let postInstance = new Post({
                    _id: req.parameters.postid,
                    content: req.body.content,
                    user: req.user._id,
                    date: post.date
                });

                return Post.findByIdAndUpdate(req.parameters.postid, postInstance)
                .then(() => res.json({
                    message: 'Successfully updated',
                    post: postInstance
                }))
            }
        })
        .catch(err => next(err))
    }
];

// Delete
module.exports.delete = function(req, res, next) {
    Post.findByIdAndRemove(req.parameters.postid)
    .then(() => res.json({ message: 'Successfully deleted', postId: req.parameters.postid }))
    .catch(err => next(err))
};