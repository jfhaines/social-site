let client = require('redis').createClient();
client.connect();
client.on('error', (err) => {
    console.log(err);
});

module.exports = client;