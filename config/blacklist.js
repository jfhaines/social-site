let express = require('express');
let router = express.Router();
let client = require('../config/redis');

router.use(function(req, res, next) {
    if (!req.jwtToken) return next()

    client.get(`bl_${req.jwtToken}`)
    .then(token => {
        if (token) {
            req.blacklisted = true;
            next()
        } else {
            req.blacklisted = false;
            next()
        };
    })
    .catch(err => next(err));
});

module.exports = router;