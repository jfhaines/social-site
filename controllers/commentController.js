let { body, validationResult } = require('express-validator');

let Comment = require('../models/commentModel');


// CREATE comment
module.exports.create = [
    body('content', 'Requires a valid comment.').trim().isLength({ min: 1 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors })

        let commentInstance = new Comment({
            content: req.body.content,
            user: req.user,
            post: req.parameters.postid,
            date: Date.now()
        });

        commentInstance.save()
        .then(() => res.json({
            message: 'Successfully created comment',
            comment: commentInstance
        }))
        .catch(err => next(err))
    }
];

// READ comment
module.exports.read = function(req, res, next) {
    Comment.findById(req.parameters.commentid).populate(['user', 'post'])
    .then(comment => res.json({ comment }))
    .catch(err => next(err))
};

// READ all comments
module.exports.readAll = function(req, res, next) {
    Comment.find({ post: req.parameters.postid }).populate(['user', 'post'])
    .then(comments => res.json({ comments }))
    .catch(err => next(err))
};

// UPDATE comment
module.exports.update = [
    body('content', 'Requires a valid comment.').trim().isLength({ min: 1 }).escape(),

    function(req, res, next) {
        let valErrors = validationResult(req);
        if (!valErrors.isEmpty()) return res.json({ valErrors })

        Comment.findById(req.parameters.commentid).populate(['user', 'post'])
        .then(comment => {
            if (String(req.user._id) !== String(comment.user._id)) {
                let error = new Error('Access forbidden');
                error.status = 403;
                return next(error);
            }

            let commentInstance = new Comment({
                _id: req.parameters.commentid,
                content: req.body.content,
                user: req.user,
                post: req.parameters.postid,
                date: comment.date
            });
    
            return Comment.findByIdAndUpdate(req.parameters.commentid, commentInstance)
            .then(() => res.json({
                message: 'Comment successfully updated',
                comment: commentInstance
            }))
        })
        .catch(err => next(err))
    }
];

// DELETE comment
module.exports.delete = function(req, res, next) {
    Comment.findById(req.parameters.commentid).populate(['user'])
    .then(comment => {
        if (String(req.user._id) !== String(comment.user._id)) {
            let error = new Error('Access forbidden');
            error.status = 403;
            return next(error);
        };

        return Comment.findByIdAndRemove(req.parameters.commentid)
        .then(() => res.json({
            message: 'Comment deleted succesfully',
            commentId: req.parameters.commentid
        }))
    })
    .catch(err => next(err))
};