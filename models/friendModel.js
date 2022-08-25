let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let friendSchema = new Schema({
    users: [{ type: mongoose.ObjectId, ref: 'users' }]
});

module.exports = mongoose.model('friends', friendSchema);