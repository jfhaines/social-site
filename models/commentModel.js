let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    content: String,
    user: { type: mongoose.ObjectId, ref: 'users' },
    post: { type: mongoose.ObjectId, ref: 'posts' },
    date: Date
});

module.exports = mongoose.model('comments', commentSchema);