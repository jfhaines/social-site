let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let friendRequestSchema = new Schema({
    sender: { type: mongoose.ObjectId, ref: 'users' }, 
    receiver: { type: mongoose.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('friend-requests', friendRequestSchema);