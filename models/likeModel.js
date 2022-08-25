let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let likeSchema = new Schema({
    user: { type: mongoose.ObjectId, ref: 'users' },
    post: { type: mongoose.ObjectId, ref: 'posts' }
});

module.exports = mongoose.model('likes', likeSchema);