let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let postSchema = new Schema({
    content: String,
    user: { type: mongoose.ObjectId, ref: 'users' },
    date: Date
});

module.exports = mongoose.model('posts', postSchema);