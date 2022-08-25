let express = require('express');
let router = express.Router()

router.use(function(req, res, next) {
    if (req.headers.authorization) {
        req.jwtToken = req.headers.authorization.split(' ')[1];
    };
    next()
});

module.exports = router;