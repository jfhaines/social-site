let mongoose = require('mongoose');

let mongoUri = 'mongodb+srv://joehaines:Hudson22F@cluster.iesxs.mongodb.net/Cluster?retryWrites=true&w=majority';

mongoose.connect(mongoUri);

let db = mongoose.connection;
db.on('error', err => console.log(err));

module.exports = db;