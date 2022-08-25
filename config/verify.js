const e = require('express');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');

router.use(function(req, res, next) {
    if (!req.jwtToken || req.blacklisted === true) {
        let error = new Error('Unauthorized')
        error.status = 401;
        return next(error);
    }

    jwt.verify(req.jwtToken, 'this-is-a-secret', function(err, payload) {
        if (err) return next(err);
        
        req.user = payload;
        next();
    });
});

module.exports = router;